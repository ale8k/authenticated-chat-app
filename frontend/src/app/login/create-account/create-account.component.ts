import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl } from "@angular/forms";
import { SessionService } from "src/app/shared/services/session.service";
import { Router } from "@angular/router";
import { ErrorStateMatcher } from "@angular/material/core";
import { map, switchMap } from "rxjs/operators";
import { timer } from "rxjs";
import { UserService } from "src/app/shared/services/user.service";
import { HttpErrorResponse } from "@angular/common/http";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: "create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"]
})
export class CreateAccountComponent implements OnInit {
  public emailMatcher = new MyErrorStateMatcher();
  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  public emailFormGroup: FormGroup;
  public usernameFormGroup: FormGroup;
  public passwordFormGroup: FormGroup;
  public completeError: string | null = null;

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {

    // We could have used a single reactive form,
    // But this felt a little nicer to look at.

    // Email group
    this.emailFormGroup = this.formBuilder.group({
      emailCtrl: new FormControl("", [
          Validators.email,
          Validators.required
        ],
        this.emailExistsValidator(this.userService)
      ),

      confirmEmailCtrl: new FormControl("", [
        Validators.email,
        Validators.required,
        this.matchOtherValidator("emailCtrl")
      ])
    });
    // Username group
    this.usernameFormGroup = this.formBuilder.group({
      usernameCtrl: new FormControl("", [
          Validators.required
        ],
        this.usernameExistsValidator(this.userService)
      )
    });
    // Password group
    this.passwordFormGroup = this.formBuilder.group({
      passwordCtrl: new FormControl("", [
          Validators.required,
          this.passwordValidator()
        ],
      ),
      confirmPasswordCtrl: new FormControl("", [
        Validators.required,
        this.matchOtherValidator("passwordCtrl")
      ]),
    });
  }

  public navigateToLogin(): void {
    this.route.navigate(["login"]);
  }

  public createUser() {
    const completedForm = {
      email: this.emailFormGroup.value.emailCtrl,
      username: this.usernameFormGroup.value.usernameCtrl,
      password: this.passwordFormGroup.value.passwordCtrl
    };

    this.userService.createNewUser(completedForm).subscribe(
      user => {
        if (user) {
          this.sessionService.login(completedForm.email, completedForm.password);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.completeError = error.statusText;
      }
    );
  }


  private matchOtherValidator(otherControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;
    return function matchOtherValidate(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error("matchOtherValidator(): other control is not found in parent group");
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          matchOther: true
        };
      }

      return null;
    };
  }

  /**
   * Refactor these two into single method, same with ApiService
   * and backend
   */

  /**
   * There must be a better way to do this...
   * @param api ApiService injection
   */
  private emailExistsValidator(api: UserService) {
    return (control: FormControl) => {
      return timer(500).pipe(
        switchMap(() => {
          return api.doesEmailExist(control.value);
        }),
        map((email) => {
          return email.exists ? { emailTaken: true } : null;
        })
      );
    };
  }

  private usernameExistsValidator(api: UserService) {
    return (control: FormControl) => {
      return timer(500).pipe(
        switchMap(() => {
          console.log(control.value);
          return api.doesUsernameExist(control.value);
        }),
        map((username) => {
          return username.exists ? { usernameTaken: true } : null;
        })
      );
    };
  }

  private passwordValidator() {
    return (control: FormControl) => {
      return !this.passwordRegex.test(control.value) ? { matchesPassRegex: true } : null;
    };
  }

}
