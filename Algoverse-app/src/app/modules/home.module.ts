import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {LandingPageComponent} from "./landing-page/component/landing-page.component";
import {SharedModule} from "../shared/shared.module";
import {MarketPlaceComponent} from "./market-place/component/market-place.component";
import {MatSliderModule} from "@angular/material/slider";
import {MatGridListModule} from "@angular/material/grid-list";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    LandingPageComponent,
    MarketPlaceComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MatSliderModule,
    MatGridListModule,
    RouterModule
  ],
  providers: [],
  exports: [
  ]
})

export class HomeModule { }
