import { AfterViewInit, Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../../core/reducers";
import { AuthService } from "../../../services/auth/auth.service";
import { Login, Logout } from "../../../core/actions/auth.actions";
import { User } from "../../../models/user.model";

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

  @Output() themeWasChanged = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
  ) { }

  ngOnInit(): any {
    this.auth();
  }


  auth(): any {
    // for a while after gonna be implemented wallet from locastorage as argument
    if (localStorage.getItem('wallet')) {
      this.authService.getUserByWallet('6CZNVPUSXFBXIZ3GKVTOLZMSGCUR36ZRDK3FQH35W53GBE7JDZHWJBQPIU')
        .subscribe(
          (user: User) => {
            this.store.dispatch(new Login({ user }))
          }
        )
    } else {
      return false;
    }
  }

  logOut() {
    this.store.dispatch(new Logout())
    this.walletConnectionPassed = false;
    localStorage.removeItem('wallet');
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
  }

}
