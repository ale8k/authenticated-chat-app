import { Component, OnInit } from "@angular/core";
import { SessionService } from "../shared/services/session.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  constructor(
    private route: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
  }

  public logout(): void {
    this.sessionService.logout();
    this.route.navigate(["login"], { replaceUrl: true });
  }

}
