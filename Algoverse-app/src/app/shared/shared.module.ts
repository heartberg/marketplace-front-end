import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {PopUpComponent} from "./pop-up/component/pop-up.component";
import { HeaderComponent } from './header/component/header.component';
import {WalletsConnectService} from "../services/wallets-connect.service";
import { DropDownSelectorComponent } from './drop-down-selector/drop-down-selector.component';
import {RouterModule} from "@angular/router";
import { CardComponent } from './card/card.component';
import { CarouselComponent } from './carousel/carousel.component';
import {SwiperModule} from "swiper/angular";
import { SwapCardComponent } from './swap-card/swap-card.component';

@NgModule({
  declarations: [
    PopUpComponent,
    HeaderComponent,
    DropDownSelectorComponent,
    CardComponent,
    CarouselComponent,
    SwapCardComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    SwiperModule,
  ],
  exports: [
    PopUpComponent,
    HeaderComponent,
    DropDownSelectorComponent,
    CardComponent,
    CarouselComponent,
    SwapCardComponent
  ],
  providers: [WalletsConnectService],
})

export class SharedModule { }
