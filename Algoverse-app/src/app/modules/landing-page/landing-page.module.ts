import {NgModule} from "@angular/core";
import {LandingPageComponent} from "./component/landing-page.component";
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "../../carousel/carousel.module";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule, Routes} from "@angular/router";

@NgModule({
  declarations:[
    LandingPageComponent
  ],
  imports: [
    SharedModule,
    CarouselModule,
    CommonModule,
    BrowserModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class LandingPageModule {

}
