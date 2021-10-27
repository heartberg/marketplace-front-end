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
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { AssetsDetailBuyComponent } from './market-place/assets-detail-buy/assets-detail-buy.component';
import {MatTreeModule} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { GetVerifiedComponent } from './get-verified/get-verified.component';
import { TokenComponent } from './token/token.component';
import { ArtistApplicationComponent } from './artists/artist-application/artist-application.component';
import { ArtistsComponent } from './artists/artists/artists.component';
import { SpaceshuttleComponent } from './artists/spaceshuttle/spaceshuttle.component';
import {MatTabsModule} from "@angular/material/tabs";
import { CreateSwapComponent } from './swap/create-swap/create-swap.component';
import { AssetDetailSwapComponent } from './swap/asset-detail-swap/asset-detail-swap.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import {CarouselModule} from "../carousel/carousel.module";

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
    CreateTradeComponent,
    ProfileEditComponent,
    AssetsDetailBuyComponent,
    CreateAssetComponent,
    GetVerifiedComponent,
    TokenComponent,
    ArtistApplicationComponent,
    ArtistsComponent,
    SpaceshuttleComponent,
    CreateSwapComponent,
    AssetDetailSwapComponent,
    CreateAuctionComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MatSliderModule,
    MatGridListModule,
    RouterModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    CarouselModule,
  ],
  providers: [],
  exports: [
  ]
})

export class HomeModule { }
