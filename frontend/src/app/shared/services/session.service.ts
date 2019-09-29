import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  private readonly sessionUrl: string = "http://127.0.0.1:5000/api/session";

  constructor(
    private http: HttpClient,
    private route: Router
  ) { }

  // #LOGIN
  public login(attemptedEmail, attemptedPassword): void {
    this.http.post(this.sessionUrl, {
      email: attemptedEmail,
      password: attemptedPassword
    },
    {
      responseType: "json",
      withCredentials: true
    }).subscribe(user => {
      console.log(user);
      this.route.navigate(["home"]);
    },
    err => {
      console.log(err);
    });
  }

  // #LOGOUT
  public logout(): void {
    this.http.delete(this.sessionUrl, {
      responseType: "text",
      withCredentials: true
    }).subscribe();
  }

  // #CONFIRM LOGGEDIN
  // Needs typing.
  public loggedInConfirmation(): Observable<{ userId: string, username: string} | null | boolean> {
    return this.http.get<{userId: string, username: string} | null>(this.sessionUrl, {
      responseType: "json",
      withCredentials: true
    });
  }

}
