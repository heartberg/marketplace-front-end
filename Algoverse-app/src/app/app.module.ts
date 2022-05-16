import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {HomeModule} from "./modules/home.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
// import {OwlModule} from "ngx-owl-carousel";
import {CarouselModule} from "./carousel/carousel.module";
// import { CarouselComponent } from './carousel/carousel.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ItemsComponent } from './modules/profile/items/items.component';
import { TradeDetailComponent } from './trade-detail/trade-detail.component';
import { TradeGridItemComponent } from './trade-grid-item/trade-grid-item.component';
import { BidGridItemComponent } from './bid-grid-item/bid-grid-item.component';
import { BidDetailComponent } from './bid-detail/bid-detail.component';
import { SwapDetailComponent } from './swap-detail/swap-detail.component';
import { SwapGridItemComponent } from './swap-grid-item/swap-grid-item.component';
import { AuctionDetailComponent } from './auction-detail/auction-detail.component';
import { AuctionGridItemComponent } from './auction-grid-item/auction-grid-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    TradeDetailComponent,
    TradeGridItemComponent,
    BidGridItemComponent,
    BidDetailComponent,
    SwapDetailComponent,
    SwapGridItemComponent,
    AuctionDetailComponent,
    AuctionGridItemComponent,
    // CarouselComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    BrowserAnimationsModule,
    CarouselModule,
    FormsModule
    // OwlModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
