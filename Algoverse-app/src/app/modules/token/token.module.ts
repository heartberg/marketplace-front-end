import {NgModule} from "@angular/core";
import {TokenComponent} from "./token.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations:[
    TokenComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class TokenModule {

}
