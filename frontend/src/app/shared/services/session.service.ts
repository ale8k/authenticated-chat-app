import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: "root"
})
export class SessionService {

  public currentUser;
  private readonly sessionUrl: string = "http://127.0.0.1:5000/api/session";

  constructor(
    private http: HttpClient,
    private route: Router,
    private socketService: SocketService
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
      this.currentUser = user;
      this.route.navigate(["home"], { replaceUrl: true });
    },
    err => {
      console.log(err);
    });
    this.socketService.connect();
    this.socketService.usersSocket.emit("user logged in", this.currentUser);
  }

  // #LOGOUT
  public logout(): void {
    this.socketService.usersSocket.emit("user logged out", this.currentUser);
    this.socketService.disconnect();
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
