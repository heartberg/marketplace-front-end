import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guard/auth.guard";

const routes: Routes = [
  // { path: 'artists', component: ArtistsComponent },
  // { path: 'artists/artist-application', component: ArtistApplicationComponent },
  // { path: 'artists/space-shuttle', component: SpaceshuttleComponent },


  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: LandingPageComponent },
  // { path: 'marketplace/:slugId', component: MarketPlaceComponent },
  // { path: 'collection', component: MyCollectionComponent },
  // { path: 'create-collection', component: CreateCollectionComponent },
  // { path: 'update-collection', component: UpdateCollectionComponent },
  // { path: 'collection/collectionId/:collectionId', component: CollectionDetailComponent },



  // { path: 'create-offer', component: CreateOfferComponent },
  // {
  //  path: 'profile',
  //  component: ProfileComponent,
  //  canActivate: [AuthGuard],
  // },
  // { path: 'profile-settings', component: ProfileSettingsComponent ,
  //   canActivate: [AuthGuard]
  // },
  // { path: 'notification-center', component: NotificationCentreComponent,
  //   canActivate: [AuthGuard]
  // },
  // { path: 'create-trade', component: CreateTradeComponent },
  // { path: 'edit-profile', component: ProfileEditComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'assets-detail-buy', component: AssetsDetailBuyComponent },
  // { path: 'create-asset', component: CreateAssetComponent },
  // { path: 'create-auction', component: CreateAuctionComponent },
  // { path: 'get-verified', component: GetVerifiedComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'token', component: TokenComponent },
  // { path: 'artists', component: ArtistsComponent },
  // { path: 'artists/artist-application', component: ArtistApplicationComponent },
  // { path: 'artists/space-shuttle', component: SpaceshuttleComponent },
  // { path: 'swap/create-swap', component: CreateSwapComponent},
  // { path: 'swap/asset-detail-swap', component: AssetDetailSwapComponent }




  {
    // Temporary measue, as there is no such thing as home component, i redirect it to landing-page
    path: 'home',
    redirectTo: '/landing-page',
    pathMatch: 'full'
  },
  {
    path: 'artists',
    loadChildren: () => import('./modules/artists/artists.module').then(m => m.ArtistsModule)
  },
  {
    path: 'collection',
    loadChildren: () => import('./modules/collection/collection.module').then(m => m.CollectionModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./modules/create/create.module').then(m => m.CreateModule)
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./modules/landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./modules/market-place/marketplace.module').then(m => m.MarketplaceModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'token',
    loadChildren: () => import('./modules/token/token.module').then(m => m.TokenModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
