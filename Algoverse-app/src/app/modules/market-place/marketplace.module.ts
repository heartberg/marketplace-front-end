import {NgModule} from "@angular/core";
import {AssetDetailSwapComponent} from "./asset-detail-swap/asset-detail-swap.component";
import {AssetsDetailBuyComponent} from "./assets-detail-buy/assets-detail-buy.component";
import {MarketPlaceComponent} from "./component/market-place.component";
import {SharedModule} from "../../shared/shared.module";
import {MatSliderModule} from "@angular/material/slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ChartsModule, WavesModule} from "angular-bootstrap-md";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations:[
    AssetDetailSwapComponent,
    AssetsDetailBuyComponent,
    MarketPlaceComponent
  ],
    imports: [
        SharedModule,
        MatSliderModule,
        MatCheckboxModule,
        ChartsModule,
        WavesModule,
        CommonModule,
        BrowserModule,
        RouterModule
    ],
  providers: [

  ],
  exports: [

  ]
})

export class MarketplaceModule {

}
