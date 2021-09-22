import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HeaderComponent} from "./component/header.component";

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  exports: [
    HeaderComponent
  ]
})

export class HeaderModule { }
