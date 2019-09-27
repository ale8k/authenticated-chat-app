import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { SessionService } from "../services/session.service";
import { map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {

    constructor(
        private route: Router,
        private sessionService: SessionService
    ) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.sessionService.loggedInConfirmation().pipe(
            map(user => {
                if (user) {
                    console.log("User session exists");
                    console.log(user);
                    return true;
                } else {
                    console.log("User session does not exist");
                    console.log(user);
                    this.route.navigate(["login"]);
                    return false;
                }
            }),
            catchError(err => {
                console.log(err);
                this.route.navigate(["login"]);
                return of(false);
            })
        );
    }
}
