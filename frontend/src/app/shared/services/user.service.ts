import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {

  private readonly userUrl: string = "http://127.0.0.1:5000/api/users";

  constructor(
    private http: HttpClient
  ) { }

  // #CREATE USER
  public createNewUser(user) {
    return this.http.post(this.userUrl, user,
      {
        responseType: "json"
      });
  }

  /*
   * Refactor these two into single method, same for back end.
   */

  public doesEmailExist(testEmail): Observable<{ exists: boolean }> {
    return this.http.post<any>(`${this.userUrl}/user-email`, { email: testEmail }, {
      responseType: "json"
    });
  }

  public doesUsernameExist(testUsername): Observable<{ exists: boolean }> {
    return this.http.post<any>(`${this.userUrl}/user-username`, { username: testUsername }, {
      responseType: "json"
    });
  }


}
