import { Component, OnInit } from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isProfileOpened = false;
  public isPopUpOpened = false;
  public isMenuRespoOpened = false;
  public isDarkModeChanged = false;
  public walletConnectionPassed = false;
  public isProfileOpenedOnRespo = false;
  public changeRespoNavAndProfileIcons = false;
  public changeRespoNavAndProfileIconsCounter = 1;
  public SearchRespoOpened = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openAvatar() {
    if (!this.isMenuRespoOpened) {
      this.isProfileOpened = !this.isProfileOpened;
    } else {
      this.isProfileOpenedOnRespo = true;
      this.changeRespoNavAndProfileIconsCounter = this.changeRespoNavAndProfileIconsCounter + 1;
      if (this.changeRespoNavAndProfileIconsCounter % 2 === 0) {
        this.changeRespoNavAndProfileIcons = true;
      } else {
        this.changeRespoNavAndProfileIcons = false;
      }
      console.log(this.changeRespoNavAndProfileIcons);
    }

  }

  connectWalletPopUp() {
    this.isPopUpOpened = !this.isPopUpOpened;
  }

  closePopUp(event: boolean) {
    this.isPopUpOpened = event;
  }

  showMenuRespo() {
    this.isMenuRespoOpened = !this.isMenuRespoOpened;
  }

  changeDarkMode() {
    this.isDarkModeChanged = !this.isDarkModeChanged
  }

  walletConnectionSucceed(event: boolean): void {
    this.isPopUpOpened = false;
    this.walletConnectionPassed = true;
  }

  openSearchRespo() {
    this.SearchRespoOpened = true;
  }

  closeSearchRespo() {
    this.SearchRespoOpened = false;
    console.log('sa')
  }
}
