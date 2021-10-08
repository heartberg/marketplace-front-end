import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {LandingPageComponent} from "./landing-page/component/landing-page.component";
import {SharedModule} from "../shared/shared.module";
import {MarketPlaceComponent} from "./market-place/component/market-place.component";
import {MatSliderModule} from "@angular/material/slider";
import {MatGridListModule} from "@angular/material/grid-list";
import {RouterModule} from "@angular/router";
import { ProfileComponent } from './profile/profile.component';
import { ProfileSettingsComponent } from './profile/profile-settings/profile-settings.component';
import { NotificationCentreComponent } from './profile/notification-centre/notification-centre.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    MarketPlaceComponent,
    ProfileComponent,
    ProfileSettingsComponent,
    NotificationCentreComponent,
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
