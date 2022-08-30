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
import { NgxSpinnerModule } from 'ngx-spinner';
import { SwapDetailComponent } from './swap-detail/swap-detail.component';
import { AuctionDetailComponent } from './auction-detail/auction-detail.component';
import { CreateWrapperComponent } from "./modules/create-wrapper/create-wrapper.component";
import {SearchWrapperComponent} from "./modules/search-wrapper/search-wrapper.component";
import {AccessComponent} from "./modules/access/access.component";
import {WhitelistGuard} from "./shared/guards/whitelist.guard";

const routes: Routes = [
  { path: '', redirectTo: 'access-beta', pathMatch: 'full'},
  { path: 'access-beta', component: AccessComponent},
  // { path: 'home', component: LandingPageComponent },
  { path: 'marketplace', component: MarketPlaceComponent, canActivate: [WhitelistGuard] },
  { path: 'search', component: SearchWrapperComponent, canActivate: [WhitelistGuard] },
  { path: 'collection', component: MyCollectionComponent, canActivate: [WhitelistGuard] },
  { path: 'create-collection', component: CreateCollectionComponent, canActivate: [WhitelistGuard] },
  { path: 'update-collection', component: UpdateCollectionComponent, canActivate: [WhitelistGuard] },
  { path: 'collection-detail/:collectionId', component: CollectionDetailComponent, canActivate: [WhitelistGuard] },
  {
    path: 'create',
    component: CreateWrapperComponent,
    canActivate: [WhitelistGuard],
    children: [
      { path: '', component: CreateAssetComponent, canActivate: [WhitelistGuard] },
      { path: 'collection', component: CreateCollectionComponent, canActivate: [WhitelistGuard] },
      { path: 'offer', component: CreateOfferComponent, canActivate: [WhitelistGuard] },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: 'create-offer', component: CreateOfferComponent, canActivate: [WhitelistGuard] },
  { path: 'profile/:wallet', component: ProfileComponent, runGuardsAndResolvers: 'always', canActivate: [WhitelistGuard] },
  { path: 'items', component: ItemsComponent, canActivate: [WhitelistGuard] },
  { path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [WhitelistGuard] },
  { path: 'notification-center', component: NotificationCentreComponent, canActivate: [WhitelistGuard] },
  { path: 'create-trade', component: CreateTradeComponent, canActivate: [WhitelistGuard] },
  { path: 'asset-detail/:itemId', component: TradeDetailComponent, canActivate: [WhitelistGuard] },
  { path: 'swap/:swapId', component: SwapDetailComponent, canActivate: [WhitelistGuard] },
  { path: 'auction/:auctionId', component: AuctionDetailComponent, canActivate: [WhitelistGuard] },
  { path: 'create-swap', component: CreateSwapComponent, canActivate: [WhitelistGuard] },
  { path: 'asset-detail-swap', component: AssetDetailSwapComponent, canActivate: [WhitelistGuard] },
  { path: 'create-bid', component: CreateBidComponent, canActivate: [WhitelistGuard] },
  { path: 'edit-profile', component: ProfileEditComponent, canActivate: [WhitelistGuard] },
  { path: 'assets-detail-buy', component: AssetsDetailBuyComponent, canActivate: [WhitelistGuard] },
  { path: 'create-asset', component: CreateAssetComponent, canActivate: [WhitelistGuard] },
  { path: 'create-auction', component: CreateAuctionComponent, canActivate: [WhitelistGuard] },
  { path: 'get-verified', component: GetVerifiedComponent, canActivate: [WhitelistGuard] },
  { path: 'token', component: TokenComponent, canActivate: [WhitelistGuard] },
  { path: 'creators', component: ArtistsComponent, canActivate: [WhitelistGuard] },
  { path: 'creators/creator-application', component: ArtistApplicationComponent },
  { path: 'creators/space-shuttle', component: SpaceshuttleComponent, canActivate: [WhitelistGuard] },
  { path: '**', redirectTo: 'access-beta' }
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
