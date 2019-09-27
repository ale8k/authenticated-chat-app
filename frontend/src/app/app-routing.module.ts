import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UnauthorisedComponent } from "./unauthorised/unauthorised.component";
import { AuthGuard } from "./shared/helpers/authorisation.guard";

const routes: Routes = [
  { path: "login", loadChildren: () => import("./login/login.module").then(m => m.LoginModule) },
  { path: "home", loadChildren: () => import("./home/home.module").then(m => m.HomeModule), canActivate: [AuthGuard] },
  { path: "unauthorised", component: UnauthorisedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
