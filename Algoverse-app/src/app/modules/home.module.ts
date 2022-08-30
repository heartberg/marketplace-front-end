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
import { CreateBidComponent } from './market-place/create-bid/create-bid.component';
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
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ItemsComponent } from "./profile/items/items.component";
import { TradeDetailComponent } from "../trade-detail/trade-detail.component";
import { TradeGridItemComponent } from "../trade-grid-item/trade-grid-item.component";
import { BidGridItemComponent } from "../bid-grid-item/bid-grid-item.component";
import { BidDetailComponent } from "../bid-detail/bid-detail.component";
import { SwapDetailComponent } from "../swap-detail/swap-detail.component";
import { SwapGridItemComponent } from "../swap-grid-item/swap-grid-item.component";
import { AuctionDetailComponent } from "../auction-detail/auction-detail.component";
import { AuctionGridItemComponent } from "../auction-grid-item/auction-grid-item.component";
import { CreateWrapperComponent } from './create-wrapper/create-wrapper.component';
import { SearchWrapperComponent } from './search-wrapper/search-wrapper.component';
import { AccessComponent } from './access/access.component';
import { AccessHeaderComponent } from './access/access-header/access-header.component';
import { BuiltInAlgorandComponent } from "./access/built-in-algorand/built-in-algorand.component";
import {SocialMediaComponent} from "./access/social-media/social-media.component";
import { AccessHeadingComponent } from './access/access-heading/access-heading.component';
import { AccessMainComponent } from './access/access-main/access-main.component';
import { AccessConnectComponent } from './access/access-connect/access-connect.component';

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
    CreateBidComponent,
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
    CreateAuctionComponent,
    ItemsComponent,
    TradeDetailComponent,
    TradeGridItemComponent,
    BidGridItemComponent,
    BidDetailComponent,
    SwapDetailComponent,
    SwapGridItemComponent,
    AuctionDetailComponent,
    AuctionGridItemComponent,
    CreateWrapperComponent,
    SearchWrapperComponent,
    AccessComponent,
    AccessMainComponent,
    AccessHeaderComponent,
    AccessHeadingComponent,
    BuiltInAlgorandComponent,
    SocialMediaComponent,
    AccessConnectComponent,
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
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [
    AccessComponent
  ]
})

export class HomeModule { }
