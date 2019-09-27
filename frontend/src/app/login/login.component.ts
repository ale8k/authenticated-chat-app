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
    console.log("Login component initialised");
  }

  public attemptUserLogin({email, password}): void {
    this.sessionService.login(email, password);
  }

  public navigateToCreateAccount(): void {
    this.route.navigate(["login/create-account"]);
  }

}
