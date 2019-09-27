import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

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
      /**
       * I would like a class for this ideally or top level prototype
       */
      userNameAndId => {
        $response.next({
          user: userNameAndId,
          error: null
        });
        this.ISLOGGEDIN = true;
      },
      err => {
        $response.next({
          user: null,
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
  // Needs typing.
  public loggedInConfirmation(): Observable<{ userId: string, username: string} | null | boolean> {
    return this.http.get<{userId: string, username: string} | null>(this.sessionUrl, {
      responseType: "json",
      withCredentials: true
    }).pipe(
      tap(console.log)
    );
  }

}
