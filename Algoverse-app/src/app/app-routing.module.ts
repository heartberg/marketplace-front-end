import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from "./modules/landing-page/component/landing-page.component";
import {MarketPlaceComponent} from "./modules/market-place/component/market-place.component";
import {ProfileComponent} from "./modules/profile/profile.component";
import {NotificationCentreComponent} from "./modules/profile/notification-centre/notification-centre.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'marketplace', component: MarketPlaceComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'profile-setting', component: ProfileComponent},
  { path: 'notification-centre', component: NotificationCentreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
