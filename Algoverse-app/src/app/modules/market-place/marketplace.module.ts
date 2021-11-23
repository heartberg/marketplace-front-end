import { NgModule } from "@angular/core";
import { AssetDetailSwapComponent } from "./asset-detail-swap/asset-detail-swap.component";
import { AssetsDetailBuyComponent } from "./assets-detail-buy/assets-detail-buy.component";
import { MarketPlaceComponent } from "./component/market-place.component";
import { SharedModule } from "../../shared/shared.module";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ChartsModule, WavesModule } from "angular-bootstrap-md";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: 'marketplace/:slugId', component: MarketPlaceComponent },
  { path: 'assets-detail-buy', component: AssetsDetailBuyComponent },
  { path: 'swap/asset-detail-swap', component: AssetDetailSwapComponent }
]

@NgModule({
  declarations: [
    AssetDetailSwapComponent,
    AssetsDetailBuyComponent,
    MarketPlaceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatSliderModule,
    MatCheckboxModule,
    ChartsModule,
    WavesModule,
    CommonModule,
    RouterModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class MarketplaceModule {

}
