import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {PopUpComponent} from "./pop-up/component/pop-up.component";
import { HeaderComponent } from './header/component/header.component';
import {WalletsConnectService} from "../services/wallets-connect.service";
import { DropDownSelectorComponent } from './drop-down-selector/drop-down-selector.component';
import {RouterModule} from "@angular/router";
import { CardComponent } from './card/card.component';
import { SwapCardComponent } from './swap-card/swap-card.component';
import { TimedAuctionCardComponent } from './timed-auction-card/timed-auction-card.component';
import { SkeletonImgComponent } from './skeleton-preloader/skeleton-img/skeleton-img.component';
import { SkeletonCardComponent } from './skeleton-preloader/skeleton-card/skeleton-card.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ScrollComponent } from './scroll/scroll.component';
import { SwiperModule } from "swiper/angular";
import { OnlyNumbers } from "./directives/only-number.directive";

@NgModule({
  declarations: [
    PopUpComponent,
    HeaderComponent,
    DropDownSelectorComponent,
    CardComponent,
    SwapCardComponent,
    TimedAuctionCardComponent,
    SkeletonImgComponent,
    SkeletonCardComponent,
    ScrollComponent,
    OnlyNumbers
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgxSpinnerModule,
    NgxSliderModule,
    SwiperModule,
  ],
  exports: [
    PopUpComponent,
    HeaderComponent,
    DropDownSelectorComponent,
    CardComponent,
    SwapCardComponent,
    TimedAuctionCardComponent,
    SkeletonImgComponent,
    SkeletonCardComponent,
    NgxSpinnerModule,
    NgxSliderModule,
    ScrollComponent,
    OnlyNumbers
  ],
  providers: [WalletsConnectService],
})

export class SharedModule { }
