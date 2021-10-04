import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {PopUpComponent} from "./pop-up/component/pop-up.component";
import { HeaderComponent } from './header/component/header.component';
import {WalletsConnectService} from "../services/wallets-connect.service";

@NgModule({
  declarations: [
    PopUpComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    PopUpComponent,
    HeaderComponent
  ],
  providers: [WalletsConnectService],
})

export class SharedModule { }
