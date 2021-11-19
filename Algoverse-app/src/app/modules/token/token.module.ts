import { NgModule } from "@angular/core";
import { TokenComponent } from "./token.component";
import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: '', component: TokenComponent }
]
@NgModule({
  declarations: [
    TokenComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class TokenModule {

}
