import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {PopUpComponent} from "./pop-up/component/pop-up.component";
import { HeaderComponent } from './header/component/header.component';
import {WalletsConnectService} from "../services/wallets-connect.service";
import { DropDownSelectorComponent } from './drop-down-selector/drop-down-selector.component';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    PopUpComponent,
    HeaderComponent,
    DropDownSelectorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
  ],
  exports: [
    PopUpComponent,
    HeaderComponent,
    DropDownSelectorComponent
  ],
  providers: [WalletsConnectService],
})

export class SharedModule { }
