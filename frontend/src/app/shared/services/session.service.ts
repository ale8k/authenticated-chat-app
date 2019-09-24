import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  public ISLOGGEDIN?: boolean;
  private readonly sessionUrl: string = "http://127.0.0.1:5000/api/session";

  constructor(
    private http: HttpClient
  ) { }

  // #LOGIN
  public login(attemptedEmail, attemptedPassword) {
    this.http.post(this.sessionUrl, {
      email: attemptedEmail,
      password: attemptedPassword
    },
    {
      responseType: "text",
      withCredentials: true
    }).subscribe(user => {
      console.log(user);
    });

  }

  // #LOGOUT
  public logout(): void {
    this.http.delete(this.sessionUrl, {
      responseType: "text",
      withCredentials: true
    }).subscribe(d => console.log(d));
  }

}
