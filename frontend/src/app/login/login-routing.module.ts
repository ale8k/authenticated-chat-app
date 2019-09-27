import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./login.component";
import { CreateAccountComponent } from "./create-account/create-account.component";


const routes: Routes = [
    { path: "create-account", component: CreateAccountComponent },
    { path: "", component: LoginComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})
export class LoginRoutingModule { }
