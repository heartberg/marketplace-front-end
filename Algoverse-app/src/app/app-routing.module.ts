import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from "./modules/landing-page/component/landing-page.component";
import { MarketPlaceComponent } from "./modules/market-place/component/market-place.component";
import { CollectionDetailComponent } from "./modules/collection/collection-detail/collection-detail.component";
import { MyCollectionComponent } from "./modules/collection/my-collection/my-collection.component";
import { CreateCollectionComponent } from "./modules/collection/create-collection/create-collection.component";
import { UpdateCollectionComponent } from "./modules/collection/update-collection/update-collection.component";
import { CreateOfferComponent } from "./modules/create-offer/create-offer.component";
import { ProfileComponent } from "./modules/profile/profile.component";
import { ProfileSettingsComponent } from "./modules/profile/profile-settings/profile-settings.component";
import { NotificationCentreComponent } from "./modules/profile/notification-centre/notification-centre.component";
import { CreateTradeComponent } from "./modules/market-place/create-trade/create-trade.component";
import { ProfileEditComponent } from "./modules/profile/profile-edit/profile-edit.component";
import { AssetsDetailBuyComponent } from "./modules/market-place/assets-detail-buy/assets-detail-buy.component";
import { CreateAssetComponent } from "./modules/create-asset/create-asset.component";
import { GetVerifiedComponent } from "./modules/get-verified/get-verified.component";
import { TokenComponent } from "./modules/token/token.component";
import { ArtistApplicationComponent } from "./modules/artists/artist-application/artist-application.component";
import { ArtistsComponent } from "./modules/artists/artists/artists.component";
import { SpaceshuttleComponent } from "./modules/artists/spaceshuttle/spaceshuttle.component";
import { CreateSwapComponent } from "./modules/swap/create-swap/create-swap.component";
import { AssetDetailSwapComponent } from "./modules/swap/asset-detail-swap/asset-detail-swap.component";
import { CreateAuctionComponent } from "./modules/create-auction/create-auction.component";
import { CreateBidComponent } from './modules/market-place/create-bid/create-bid.component';
import { ItemsComponent } from './modules/profile/items/items.component';
import { TradeDetailComponent } from './trade-detail/trade-detail.component';
import { BidDetailComponent } from './bid-detail/bid-detail.component';
import { SwapDetailComponent } from './swap-detail/swap-detail.component';
import { AuctionDetailComponent } from './auction-detail/auction-detail.component';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'marketplace/:slugId', component: MarketPlaceComponent },
  { path: 'collection', component: MyCollectionComponent },
  { path: 'create-collection', component: CreateCollectionComponent },
  { path: 'update-collection', component: UpdateCollectionComponent },
  { path: 'collection-detail/:collectionId', component: CollectionDetailComponent },
  { path: 'create-offer', component: CreateOfferComponent },
  { path: 'profile/:wallet', component: ProfileComponent, runGuardsAndResolvers: 'always'},
  { path: 'items', component: ItemsComponent },
  { path: 'profile-settings', component: ProfileSettingsComponent },
  { path: 'notification-center', component: NotificationCentreComponent },
  { path: 'create-trade', component: CreateTradeComponent },
  { path: 'trade/:tradeId', component: TradeDetailComponent},
  { path: 'bid/:bidId', component: BidDetailComponent},
  { path: 'create-swap', component: CreateSwapComponent },
  { path: 'asset-detail-swap', component: AssetDetailSwapComponent },
  { path: 'swap/:swapId', component: SwapDetailComponent},
  { path: 'auction/:auctionId', component: AuctionDetailComponent},
  { path: 'create-bid', component: CreateBidComponent },
  { path: 'edit-profile', component: ProfileEditComponent },
  { path: 'assets-detail-buy', component: AssetsDetailBuyComponent },
  { path: 'create-asset', component: CreateAssetComponent },
  { path: 'create-auction', component: CreateAuctionComponent },
  { path: 'get-verified', component: GetVerifiedComponent },
  { path: 'token', component: TokenComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'artists/artist-application', component: ArtistApplicationComponent },
  { path: 'artists/space-shuttle', component: SpaceshuttleComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"}),
    NgxSpinnerModule
  ],
  exports: [
    RouterModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule { }
