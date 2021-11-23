import { NgModule } from "@angular/core";
import { CreateOfferComponent } from "./create-offer/create-offer.component";
import { CreateAssetComponent } from "./create-offer/create-asset/create-asset.component";
import { CreateAuctionComponent } from "./create-offer/create-auction/create-auction.component";
import { CreateSwapComponent } from "./create-offer/create-swap/create-swap.component";
import { CreateTradeComponent } from "./create-offer/create-trade/create-trade.component";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: 'create-asset', component: CreateAssetComponent },
  { path: 'create-auction', component: CreateAuctionComponent },
  { path: 'create-trade', component: CreateTradeComponent },
  { path: 'create-offer', component: CreateOfferComponent },
  // this should go here
  { path: 'swap/create-swap', component: CreateSwapComponent }
]
@NgModule({
  declarations: [
    CreateOfferComponent,
    CreateAssetComponent,
    CreateAuctionComponent,
    CreateSwapComponent,
    CreateTradeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    CommonModule,
    RouterModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class CreateModule {

}
