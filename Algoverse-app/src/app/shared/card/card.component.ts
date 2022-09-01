import {Component, Input, OnInit} from '@angular/core';
import {ThemeService} from "../../services/theme.service";
import {SessionWallet} from "algorand-session-wallet";
import {WalletsConnectService} from "../../services/wallets-connect.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() mItem: any = {};
  @Input() isCollection: boolean = false;
  public isHovered: boolean = false;
  public isStarred: boolean = false;
  public isDark: boolean = false;
  private wallet: SessionWallet | undefined;
  private collectionStar: any;
  public stars: number = 0;

  constructor(
    private readonly _themeService: ThemeService,
    private readonly _walletsConnectService: WalletsConnectService,
    private readonly _userService: UserService) { }

  ngOnInit(): void {
    if (this.isCollection) {
      this.stars = this.mItem.stars;
      this.subscribeToThemeColor();
      this.wallet = this._walletsConnectService.sessionWallet;
      this.getStar();
    }
  }

  private getStar(): void {
    if (this.wallet) {
      this._userService.getCollectionStar(this.wallet.getDefaultAccount(), this.mItem.collectionId).subscribe(
        (res: any) => {
          if(res) {
            this.collectionStar = res;
            this.isStarred = true;
          } else {
            this.collectionStar = undefined;
            this.isStarred = false;
          }
        }, error => {
          this.isStarred = false;
          this.collectionStar = undefined;
        }
      )
    }
  }


  public addOrRemoveStar(event: Event): void {
    event.stopPropagation();
    if (this.isStarred) {
      return this.removeStar();
    }
    if (this.wallet) {
      const params = {
        collectionId: this.mItem.collectionId,
        wallet: this.wallet.getDefaultAccount()
      }
      this._userService.addCollectionStar(params).subscribe(
        (res) => {
          this.collectionStar = res;
          this.isStarred = true;
          this.stars++;
        }
      )
    } else {
      alert("connect wallet")
    }
  }

  private removeStar(): void {
    if (this.wallet) {
      this._userService.removeCollectionStar(this.collectionStar.collectionStarId).subscribe(
        (value: any) => {
          this.isStarred = false;
          this.stars--;
          console.log("removed star");
        }
      )
    } else {
      alert("connect wallet")
    }
  }

  private subscribeToThemeColor(): void {
    this._themeService.$colorTheme.subscribe((theme: string) => {
      theme === "dark" ? this.isDark = true : this.isDark = false;
    })
  }
}
