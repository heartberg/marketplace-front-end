import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from "./modules/landing-page/component/landing-page.component";
import {MarketPlaceComponent} from "./modules/market-place/component/market-place.component";
import {CollectionDetailComponent} from "./modules/collection/collection-detail/collection-detail.component";
import {MyCollectionComponent} from "./modules/collection/my-collection/my-collection.component";
import {CreateCollectionComponent} from "./modules/collection/create-collection/create-collection.component";
import {UpdateCollectionComponent} from "./modules/collection/update-collection/update-collection.component";
import {CreateOfferComponent} from "./modules/create/create-offer/create-offer.component";
import {ProfileComponent} from "./modules/profile/profile.component";
import {ProfileSettingsComponent} from "./modules/profile/profile-settings/profile-settings.component";
import {NotificationCentreComponent} from "./modules/profile/notification-centre/notification-centre.component";
import {CreateTradeComponent} from "./modules/create/create-offer/create-trade/create-trade.component";
import {ProfileEditComponent} from "./modules/profile/profile-edit/profile-edit.component";
import {AssetsDetailBuyComponent} from "./modules/market-place/assets-detail-buy/assets-detail-buy.component";
import {CreateAssetComponent} from "./modules/create/create-offer/create-asset/create-asset.component";
import {GetVerifiedComponent} from "./modules/profile/get-verified/get-verified.component";
import {TokenComponent} from "./modules/token/token.component";
import {ArtistApplicationComponent} from "./modules/artists/artist-application/artist-application.component";
import {ArtistsComponent} from "./modules/artists/artists/artists.component";
import {SpaceshuttleComponent} from "./modules/artists/spaceshuttle/spaceshuttle.component";
import {CreateSwapComponent} from "./modules/create/create-offer/create-swap/create-swap.component";
import {AssetDetailSwapComponent} from "./modules/market-place/asset-detail-swap/asset-detail-swap.component";
import {CreateAuctionComponent} from "./modules/create/create-offer/create-auction/create-auction.component";
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'marketplace/:slugId', component: MarketPlaceComponent },
  { path: 'collection', component: MyCollectionComponent },
  { path: 'create-collection', component: CreateCollectionComponent },
  { path: 'update-collection', component: UpdateCollectionComponent },
  { path: 'collection/collectionId/:collectionId', component: CollectionDetailComponent },
  { path: 'create-offer', component: CreateOfferComponent },
  {
   path: 'profile',
   component: ProfileComponent,
   canActivate: [AuthGuard],
  },
  { path: 'profile-settings', component: ProfileSettingsComponent ,
    canActivate: [AuthGuard]
  },
  { path: 'notification-center', component: NotificationCentreComponent,
    canActivate: [AuthGuard]
  },
  { path: 'create-trade', component: CreateTradeComponent },
  { path: 'edit-profile', component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'assets-detail-buy', component: AssetsDetailBuyComponent },
  { path: 'create-asset', component: CreateAssetComponent },
  { path: 'create-auction', component: CreateAuctionComponent },
  { path: 'get-verified', component: GetVerifiedComponent,
    canActivate: [AuthGuard],
  },
  { path: 'token', component: TokenComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'artists/artist-application', component: ArtistApplicationComponent },
  { path: 'artists/space-shuttle', component: SpaceshuttleComponent },
  { path: 'swap/create-swap', component: CreateSwapComponent},
  { path: 'swap/asset-detail-swap', component: AssetDetailSwapComponent }

  // {
  //   path: '',
  //   redirectTo: '/landing-page',
  //   pathMatch: 'full'
  // },
//   {
//     path: 'artists',
//     loadChildren: () => import('./modules/artists/artists.module').then( m => m.ArtistsModule);
//   },
  // {
  //   path: 'collection',
  //   loadChildren: () => import('./modules/collection/collection.module').then( m => m.CollectionModule)
  // },
  // {
  //   path: 'create',
  //   loadChildren: () => import('./modules/create/create.module').then( m => m.CreateModule)
  // },
  // {
  //   path: 'landing-page',
  //   loadChildren: () => import('./modules/landing-page/landing-page.module').then( m => m.LandingPageModule)
  // },
  // {
  //   path: 'marketplace',
  //   loadChildren: () => import('./modules/market-place/marketplace.module').then( m => m.MarketplaceModule)
  // },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./modules/profile/profile.module').then( m => m.ProfileModule)
  // },
  // {
  //   path: 'token',
  //   loadChildren: () => import('./modules/token/token.module').then( m => m.TokenModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
