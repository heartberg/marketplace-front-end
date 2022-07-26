import {Component, OnInit} from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {NgxSpinnerService} from "ngx-spinner";
import {environment} from 'src/environments/environment';
import {debounceTime} from 'rxjs/operators';
import {UserService} from "../../../services/user.service";
import {SearchService} from "../../../services/search.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isProfileOpened = false;
  public isPopUpOpened = false;
  public isMenuRespoOpened = false;
  public isDarkMode = false;
  public walletConnectionPassed = false;
  public isProfileOpenedOnRespo = false;
  public changeRespoNavAndProfileIcons = false;
  public changeRespoNavAndProfileIconsCounter = 1;
  public SearchRespoOpened = false;
  public wallet = "default";
  public balance: string = "0";
  public version = environment.VERSION
  public isLoggedIn: boolean = false;
  public isPopUpOpenedSecond: boolean = false;
  public isBalanceLoading: boolean = false;
  public spinnerName: string = 'balance-spinner';

  private inputChange: Subject<string> = new Subject<string>();
  private debounceTime: number = 300;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private _walletsConnectService: WalletsConnectService,
    private readonly _themeService: ThemeService,
    private readonly spinner: NgxSpinnerService,
    private readonly _searchService: SearchService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    if (this._walletsConnectService.sessionWallet && this._walletsConnectService.sessionWallet!.connected()) {
      console.log("hit1")
      this.isLoggedIn = true;
    }
    if (localStorage.getItem('wallet') || localStorage.getItem('PeraWallet.Wallet')) {
      console.log("hit2")
      this.walletConnectionPassed = true;
    }
    this.receiveTheme();

    this.router.onSameUrlNavigation = "reload";

    this.subscribeToSearchChange();
    this.subscribeToRouteChange();
  }

  async openAvatar() {
    this.wallet = this._walletsConnectService.sessionWallet!.getDefaultAccount();

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

    this.spinner.show(this.spinnerName);
    this.isBalanceLoading = true;

    let algoAmount = await this._walletsConnectService.getBalance();
    if (algoAmount) {
      this.spinner.hide(this.spinnerName);
      this.isBalanceLoading = false;
    }
    if (algoAmount >= 100000) {
      this.balance = (algoAmount / 1000).toFixed(2) + "k"
    } else {
      this.balance = algoAmount.toFixed(2)
    }
  }

  openProfile() {
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(["/profile/" + this.wallet]);
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
    if (!this.isDarkMode) {
      this._themeService.setColorTheme('dark');
    } else {
      this._themeService.setColorTheme('light');
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

  private receiveTheme(): void {
    this._themeService.$colorTheme.subscribe((theme: string) => {
      theme === 'dark' ? this.isDarkMode = true : this.isDarkMode = false;
    });
  }

  showNotifications(): void {
    this.router.navigateByUrl("/notification-center")
  }

  public onSearchChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    if (element.value) {
      this.inputChange.next(element.value);
      return;
    }
    this._searchService.$searchResult.next(null);
  }

  private subscribeToSearchChange(): void {
    this.subscription = this.inputChange
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((value: string) => {
        this._searchService.globalSearch(value).subscribe(response => {
          this.router.navigate(["/search"]);
          this._searchService.setSearchResult = response;
          this._searchService.setSearchValue = value;
        });
      });
  }

  public handeOutsideClick(): void {
    this.isProfileOpened = false;
  }

  private subscribeToRouteChange(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isProfileOpened = false;
      }
    });
  }
}
