import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {LandingPageComponent} from "./landing-page/component/landing-page.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [],
  exports: [
  ]
})

export class HomeModule { }
