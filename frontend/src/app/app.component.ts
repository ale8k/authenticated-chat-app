import { Component, OnInit } from "@angular/core";
import { ApiService } from "./shared/services/api.service";
import { Router } from "@angular/router";
import { SessionService } from "./shared/services/session.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  constructor(
    private route: Router,
  ) { }

  public ngOnInit(): void {
    // Has session?
    // Home route
    // else
    this.route.navigateByUrl("login");
  }
}
