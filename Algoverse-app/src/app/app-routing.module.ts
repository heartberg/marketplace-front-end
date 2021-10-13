import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from "./modules/landing-page/component/landing-page.component";
import {MarketPlaceComponent} from "./modules/market-place/component/market-place.component";
import {CollectionDetailComponent} from "./modules/collection/collection-detail/collection-detail.component";
import {MyCollectionComponent} from "./modules/collection/my-collection/my-collection.component";
import {CreateCollectionComponent} from "./modules/collection/create-collection/create-collection.component";
import {UpdateCollectionComponent} from "./modules/collection/update-collection/update-collection.component";
import {CreateOfferComponent} from "./modules/create-offer/create-offer.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'marketplace', component: MarketPlaceComponent },
  { path: 'collection', component: MyCollectionComponent },
  { path: 'create-collection', component: CreateCollectionComponent },
  { path: 'update-collection', component: UpdateCollectionComponent },
  { path: 'collection-detail', component: CollectionDetailComponent },
  { path: 'create-offer', component: CreateOfferComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
