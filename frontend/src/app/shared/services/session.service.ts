import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  // To protect routes!
  public ISLOGGEDIN?: boolean = false;

  private readonly sessionUrl: string = "http://127.0.0.1:5000/api/session";
  private readonly userUrl: string = "http://127.0.0.1:5000/api/users";

  constructor(
    private http: HttpClient,
    private route: Router
  ) { }

  // #CREATE USER
  public createNewUser(user) {
    return this.http.post(this.userUrl, user,
    {
      responseType: "json"
    });
  }

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
    }).subscribe(userNameAndId => this.ISLOGGEDIN = false);
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
