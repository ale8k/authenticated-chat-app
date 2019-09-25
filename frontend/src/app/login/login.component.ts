import { Component, OnInit } from "@angular/core";
import { SessionService } from "../shared/services/session.service";
import { Router } from "@angular/router";

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
    this.sessionService.login(email, password).subscribe((response) => {

    });

  }

  public attemptUserLogout(): void {
    this.sessionService.logout();
  }

  public confirmUserIsLoggedIn() {
    this.sessionService.loginConfirmation();
    this.route.navigate(["home"]);
  }

}
