import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  // To protect routes!
  public ISLOGGEDIN?: boolean = false;

  private readonly sessionUrl: string = "http://127.0.0.1:5000/api/session";

  constructor(
    private http: HttpClient
  ) { }

  // #LOGIN
  public login(attemptedEmail, attemptedPassword) {
    const $response = new Subject<{user} | {error: HttpErrorResponse}>();

    this.http.post(this.sessionUrl, {
      email: attemptedEmail,
      password: attemptedPassword
    },
    {
      responseType: "text",
      withCredentials: true
    }).subscribe(
      userNameAndId => {
        $response.next({
          user: userNameAndId
        });
        this.ISLOGGEDIN = true;
      },
      err => {
        $response.next({
          error: err
        });
        this.ISLOGGEDIN = false;
      }
    );

    return $response;

  }

  // #LOGOUT
  public logout(): void {
    this.http.delete(this.sessionUrl, {
      responseType: "text",
      withCredentials: true
    }).subscribe(userNameAndId => this.ISLOGGEDIN = false);
  }

  // #CONFIRM LOGGEDIN
  public loginConfirmation(): void {
    this.http.get(this.sessionUrl, {
      responseType: "text",
      withCredentials: true
    }).subscribe(d => console.log(d));
  }

}
