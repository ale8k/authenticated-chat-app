import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { SessionService } from "src/app/shared/services/session.service";
import { Router } from "@angular/router";

@Component({
  selector: "create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"]
})
export class CreateAccountComponent implements OnInit {

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public isOptional = false;

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ""
    });
  }

  public createAccount(user) {
    this.sessionService.createNewUser(user).subscribe(
      userResp => {
        console.log(userResp);
      },
      err => {
        console.log(err);
      }
    );
  }

  public navigateToLogin(): void {
    this.route.navigate(["login"]);
  }
}
