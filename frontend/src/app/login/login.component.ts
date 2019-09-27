import { Component, OnInit } from "@angular/core";
import { SessionService } from "../shared/services/session.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  constructor(
    private route: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  }

  public attemptUserLogin({email, password}): void {
    this.sessionService.login(email, password).subscribe((response: { user: any | null, error: HttpErrorResponse | null }) => {
      if (response.error == null) {
        this.route.navigate(["home"]);
      }
    });

  }

  public attemptUserLogout(): void {
    this.sessionService.logout();
  }

  public confirmUserIsLoggedIn() {
    this.sessionService.loggedInConfirmation().subscribe();
  }

}
