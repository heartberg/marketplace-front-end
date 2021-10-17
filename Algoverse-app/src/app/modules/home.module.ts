import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {LandingPageComponent} from "./landing-page/component/landing-page.component";
import {SharedModule} from "../shared/shared.module";
import {MarketPlaceComponent} from "./market-place/component/market-place.component";
import {MatSliderModule} from "@angular/material/slider";
import {MatGridListModule} from "@angular/material/grid-list";
import {RouterModule} from "@angular/router";
import { MyCollectionComponent } from './collection/my-collection/my-collection.component';
import { CreateCollectionComponent } from './collection/create-collection/create-collection.component';
import { UpdateCollectionComponent } from './collection/update-collection/update-collection.component';
import { CollectionDetailComponent } from './collection/collection-detail/collection-detail.component';
import {HttpClientModule} from "@angular/common/http";
import { CreateOfferComponent } from './create-offer/create-offer.component';
import {ProfileComponent} from "./profile/profile.component";
import {ProfileSettingsComponent} from "./profile/profile-settings/profile-settings.component";
import {NotificationCentreComponent} from "./profile/notification-centre/notification-centre.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { CreateTradeComponent } from './market-place/create-trade/create-trade.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    MarketPlaceComponent,
    MyCollectionComponent,
    CreateCollectionComponent,
    UpdateCollectionComponent,
    CollectionDetailComponent,
    CreateOfferComponent,
    ProfileComponent,
    ProfileSettingsComponent,
    NotificationCentreComponent,
    CreateTradeComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MatSliderModule,
    MatGridListModule,
    RouterModule,
    HttpClientModule,
    MatSlideToggleModule
  ],
  providers: [],
  exports: [
  ]
})

export class HomeModule { }
