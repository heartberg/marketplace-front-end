import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

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
  public wallet = "default";
  public balance: string = "0";

  public isLoggedIn: boolean = false;

  public isPopUpOpenedSecond: boolean = false;
  @Output() themeWasChanged = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private _walletsConnectService: WalletsConnectService,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this._walletsConnectService.sessionWallet && this._walletsConnectService.sessionWallet!.connected()) {
      console.log("hit1")
      this.isLoggedIn = true;
    }
    if (localStorage.getItem('wallet') || localStorage.getItem('PeraWallet.Wallet')) {
      console.log("hit2")
      this.walletConnectionPassed = true;
    }
  }

  async openAvatar() {
    this.wallet = this._walletsConnectService.sessionWallet!.getDefaultAccount();

    let algoAmount = await this._walletsConnectService.getBalance()
      if(algoAmount >= 100000) {
        this.balance = (algoAmount / 1000).toFixed(2) + "k"
      } else {
        this.balance = algoAmount.toFixed(2)
      }
      console.log(this.balance)

    if (this.isProfileOpened) {
      localStorage.setItem('opened', JSON.stringify(true))
    } else {
      localStorage.setItem('opened', JSON.stringify(false))
    }
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
    this.isPopUpOpenedSecond = event;
  }

  showMenuRespo() {
    this.isMenuRespoOpened = !this.isMenuRespoOpened;
  }

  changeDarkMode() {
    this.isDarkModeChanged = !this.isDarkModeChanged
    if (this.isDarkModeChanged) {
      this.themeWasChanged.emit(true);
    } else {
      this.themeWasChanged.emit(false);
    }
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

  switcher() {
    this.isPopUpOpenedSecond = true;
  }

  logOut() {
    this._walletsConnectService.disconnect();
  }

  switched(event: any) {
    this.isPopUpOpenedSecond = event;
  }
}
