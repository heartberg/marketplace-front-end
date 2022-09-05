import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SessionWallet} from "algorand-session-wallet";
import {ThemeService} from "../../services/theme.service";
import {WalletsConnectService} from "../../services/wallets-connect.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-updated-collection-card',
  templateUrl: './updated-collection-card.component.html',
  styleUrls: ['./updated-collection-card.component.scss']
})
export class UpdatedCollectionCardComponent implements OnInit {
  @Input() public item: any;
  public isHovered: boolean = false;
  public isStarred: boolean = false;
  private wallet: SessionWallet | undefined;
  private collectionStar: any;
  private isDark: boolean = false;

  constructor(
    private readonly _themeService: ThemeService,
    private readonly _walletsConnectService: WalletsConnectService,
    private readonly _userService: UserService,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.wallet = this._walletsConnectService.sessionWallet;
    this.getStar();
  }

  private getStar(): void {
    if (this.wallet) {
      this._userService.getCollectionStar(this.wallet.getDefaultAccount(), this.item.collectionId).subscribe(
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
        collectionId: this.item.collectionId,
        wallet: this.wallet.getDefaultAccount()
      }
      this._userService.addCollectionStar(params).subscribe(
        (res) => {
          this.collectionStar = res;
          this.isStarred = true;
          this.item.stars++;
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
          this.item.stars--;
          console.log("removed star");
        }
      )
    } else {
      alert("connect wallet")
    }
  }

  public navigateToCreatorProfile(event: Event): void {
    event.stopPropagation();
    this.router.navigate([`profile/${this.item.creator.wallet}`])
  }
}
