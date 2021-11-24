import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guard/auth.guard";

const routes: Routes = [

  {
    // Temporary measue, as there is no such thing as home component, i redirect it to landing-page
    path: '',
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
