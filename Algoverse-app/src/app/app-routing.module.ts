import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from "./modules/landing-page/component/landing-page.component";
import {MarketPlaceComponent} from "./modules/market-place/component/market-place.component";
import {CollectionDetailComponent} from "./modules/collection/collection-detail/collection-detail.component";
import {MyCollectionComponent} from "./modules/collection/my-collection/my-collection.component";
import {CreateCollectionComponent} from "./modules/collection/create-collection/create-collection.component";
import {UpdateCollectionComponent} from "./modules/collection/update-collection/update-collection.component";
import {CreateOfferComponent} from "./modules/create-offer/create-offer.component";
import {ProfileComponent} from "./modules/profile/profile.component";
import {ProfileSettingsComponent} from "./modules/profile/profile-settings/profile-settings.component";
import {NotificationCentreComponent} from "./modules/profile/notification-centre/notification-centre.component";
import {CreateTradeComponent} from "./modules/market-place/create-trade/create-trade.component";
import {ProfileEditComponent} from "./modules/profile/profile-edit/profile-edit.component";
import {AssetsDetailBuyComponent} from "./modules/market-place/assets-detail-buy/assets-detail-buy.component";
import {CreateAssetComponent} from "./modules/create-asset/create-asset.component";
import {GetVerifiedComponent} from "./modules/get-verified/get-verified.component";
import {TokenComponent} from "./modules/token/token.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'marketplace', component: MarketPlaceComponent },
  { path: 'collection', component: MyCollectionComponent },
  { path: 'create-collection', component: CreateCollectionComponent },
  { path: 'update-collection', component: UpdateCollectionComponent },
  { path: 'collection-detail', component: CollectionDetailComponent },
  { path: 'create-offer', component: CreateOfferComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile-settings', component: ProfileSettingsComponent },
  { path: 'notification-center', component: NotificationCentreComponent },
  { path: 'create-trade', component: CreateTradeComponent },
  { path: 'edit-profile', component: ProfileEditComponent },
  { path: 'assets-detail-buy', component: AssetsDetailBuyComponent },
  { path: 'create-asset', component: CreateAssetComponent },
  { path: 'get-verified', component: GetVerifiedComponent },
  { path: 'token', component: TokenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
