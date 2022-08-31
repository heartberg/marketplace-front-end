import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MarketplaceTypeEnum} from "../../models";
import {interval, Subscription} from "rxjs";
import moment from 'moment';
import {WalletsConnectService} from "../../services/wallets-connect.service";
import {UserService} from "../../services/user.service";
import {SessionWallet} from "algorand-session-wallet";
import {countDownFormatter, isCountdownValid} from "../utils";
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-updated-card',
  templateUrl: './updated-card.component.html',
  styleUrls: ['./updated-card.component.scss']
})
export class UpdatedCardComponent implements OnInit, OnDestroy {

  @Input() public item: any;
  @Input() public type: MarketplaceTypeEnum = MarketplaceTypeEnum.ALL;

  public marketplaceTypes: typeof MarketplaceTypeEnum = MarketplaceTypeEnum;
  public auctionCountdown: string = "00:00:00";
  public highestBid: number = 0;
  public heartHovered: boolean = false;
  public isStarred: boolean = false;
  public stars: number = 0;

  private $subscription: Subscription = new Subscription();
  private timeDiff: moment.Duration = moment.duration();
  private assetStar: any;
  private assetId: number = 0;
  private wallet: SessionWallet | undefined;
  public isHovered: boolean = false;
  public isDark: boolean = false;

  constructor(
    private readonly _walletsConnectService: WalletsConnectService,
    private readonly _userService: UserService,
    private readonly _themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.subscribeToThemeColor();
    this.wallet = this._walletsConnectService.sessionWallet;

    if (this.type === this.marketplaceTypes.AUCTION && this.item.bids.length) {
      this.findForHighestBid();
    }

    if (this.type === MarketplaceTypeEnum.AUCTION) {
      this.timeDiff = moment.duration(moment(moment.unix(this.item.closingDate)).diff(moment()));
      this.$subscription = interval(1000).subscribe(() => this.startCountdown());
    }

    if (this.type !== MarketplaceTypeEnum.ALL && this.type !== MarketplaceTypeEnum.SWAP) {
      this.assetId = this.item.asset.assetId;
      this.stars = this.item.asset.stars;
    }

    if (this.type === MarketplaceTypeEnum.SWAP) {
      this.assetId = this.item.acceptingAsset.assetId;
      this.stars = this.item.acceptingAsset.stars;
    }

    if (this.type === MarketplaceTypeEnum.ALL) {
      this.assetId = this.item.assetId;
      this.stars = this.item.stars;
    }

    this.getStar();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  private startCountdown(): void {
    this.timeDiff.subtract(1, 'second');
    if(!isCountdownValid(this.timeDiff)) {
      this.auctionCountdown = "Ended";
      this.$subscription.unsubscribe();
      return;
    }
    this.auctionCountdown = countDownFormatter(this.timeDiff);
  }

  private findForHighestBid(): void {
    this.highestBid = Math.max(...this.item.bids.map((bid: any) => bid.amount));
  }


  private getStar(): void {
    if (this.wallet) {
      this._userService.getAssetStar(this.wallet.getDefaultAccount(), this.assetId).subscribe(
        (res: any) => {
          if(res) {
            this.assetStar = res;
            this.isStarred = true;
          } else {
            this.assetStar = undefined;
            this.isStarred = false;
          }
        }, error => {
          this.isStarred = false;
          this.assetStar = undefined;
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
        assetId: this.assetId,
        wallet: this.wallet.getDefaultAccount()
      }
      this._userService.addAssetStar(params).subscribe(
        (res) => {
          this.assetStar = res;
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
      this._userService.removeAssetStar(this.assetStar.assetStarId).subscribe(
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
