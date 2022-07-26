import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import algosdk from 'algosdk';
import { ADDRCONFIG } from 'dns';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient } from 'src/app/services/utils.algod';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import {SessionWallet} from "algorand-session-wallet";
import {Location} from "@angular/common";
import { NgxSpinnerService } from 'ngx-spinner';
import { MarketplaceTypeEnum } from 'src/app/models';
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [Location]
})
export class ProfileComponent implements OnInit, OnDestroy{
  userProfile: any;
  userCollections: any[] = [];
  myAssets: any = [];
  createdAssets: any = [];
  forSale: any = [];
  forSwap: any = [];
  forAuction: any = [];
  myBids: any = [];
  myAuctionBids: any = [];
  swapRequests: any = [];
  starred: any = [];
  isOwnProfile: boolean = false;
  navigationSubscription: any;
  public isTruncated: boolean = true;
  public following: any;
  public showFollowers = false;
  public popupOpen = false;
  public walletAddress = "";
  public marketplaceTypes: typeof MarketplaceTypeEnum = MarketplaceTypeEnum;
  public isDark: boolean = false;

  constructor(
    private userService: UserService,
    private connectService: WalletsConnectService,
    private _stateService: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly location: Location,
    private readonly walletsConnectService: WalletsConnectService,
    private spinner: NgxSpinnerService,
    private readonly _themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initialiseProfile();
    this.subscribeToThemeColor();
    this.detectOwnProfile(this.connectService.sessionWallet);
  }

  initialiseProfile() {
    const routeParams = this.route.snapshot.paramMap
    console.log(routeParams)
    const addr = routeParams.get('wallet')
    console.log("router param: ", addr)
    if(addr) {
      if(algosdk.isValidAddress(addr)){
        console.log("address detected")
        this.walletAddress = addr
        this.userService.loadProfile(this.walletAddress).subscribe(
          (res: any) => {
            this.userProfile = res;
            if (this.userProfile.customURL) {
              this.location.replaceState(`profile/${this.userProfile.customURL}`);
            }
            console.log(this.userProfile)
            let wallet = this.connectService.sessionWallet
            this.detectOwnProfile(wallet)
            console.log("wallet:", wallet)

            this.loadAssets()

            if(wallet) {
              console.log("CHECK FOLLOWING")
              this.following = this.userProfile.followers.find((follow: any) => {
                return follow.followingUserWallet == wallet!.getDefaultAccount()
              })
              console.log("user following: ", this.following)
            } else {
              this.following = undefined
            }
          }
        )
      } else {
        this.userService.loadProfileByCustomUrl(addr).subscribe(
          (res: any) => {
            this.userProfile = res
            console.log(this.userProfile)
            this.walletAddress = this.userProfile.wallet
            let wallet = this.connectService.sessionWallet
            this.detectOwnProfile(wallet);
            this.loadAssets()
            console.log("wallet:", wallet)
            if(wallet) {
              console.log("CHECK FOLLOWING")
              this.following = this.userProfile.followers.find((follow: any) => {
                return follow.followingUserWallet == wallet!.getDefaultAccount()
              })
              console.log("user following: ", this.following)
            } else {
              this.following = undefined
            }
          }, error => {
            alert("No Profile found with this URL")
            this.router.navigateByUrl("home")
          }
        )
      }
    }
  }

  loadAssets() {

    this.userService.loadUserAssets(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.myAssets = res
      }
    )

    this.userService.loadUserCreatedAssets(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.createdAssets = res
      }
    )

    console.log('user wallet', this.walletAddress);

    this.userService.loadTrades(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.forSale = res
      }
    )

    this.userService.loadAuctionsWithMyBids(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.myAuctionBids = res
      }
    )

    this.userService.loadSwaps(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.forSwap = res
      }
    )

    this.userService.loadAuctions(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.forAuction = res
      }
    )

    this.userService.loadBids(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res)
        this.myBids = res
      }
    )

    this.userService.loadStarredAssets(this.walletAddress).subscribe(
      (res: any) => {
        console.log(res);
        this.starred = res
      }
    )
    this.userService.loadCollections(this.walletAddress).subscribe(
      (collections: any) => {
        this.userCollections = collections
        this._stateService.collections = collections;
      }
    )
  }

  followAction() {
    if(this.following) {
      console.log("unfollow")
      this.userService.unfollow(this.following.followingId).subscribe(
        (res: any) => {
          console.log("unfollowed")
          this.userProfile.followers.splice(this.userProfile.followers.findIndex((item: any) => item.followingId == this.following.followingId), 1)
          this.following = undefined
        }
      )
    } else {
      console.log("follow")
      const params = {
        followingUserWallet: this.connectService.sessionWallet!.getDefaultAccount(),
        followedUserWallet: this.userProfile.wallet
      }
      this.userService.follow(params).subscribe(
        (res: any) => {
          console.log(res)
          this.following = res
          this.userProfile.followers.push(res)
        }
      )
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  public expandOrCollapseBio() {
    this.isTruncated = !this.isTruncated;
  }

  showFollow(showFollowers: boolean) {
    this.showFollowers = showFollowers;
    console.log(this.userProfile.followers)
    console.log(this.userProfile.followed)
    this.popupOpen = true;
  }

  closePopUp($event: boolean) {
    this.popupOpen = $event;
  }

  private detectOwnProfile(wallet: SessionWallet | undefined) {
    if (wallet) {
      let connectedWallet = wallet.getDefaultAccount();
      if (connectedWallet == this.walletAddress) {
        this.isOwnProfile = true;
      } else {
        console.log("not same address");
        this.isOwnProfile = false;
      }
    } else {
      console.log("not wallet");
    }
  }

  private subscribeToThemeColor(): void {
    this._themeService.$colorTheme.subscribe((theme: string) => {
      theme === "dark" ? this.isDark = true : this.isDark = false;
    });
  }
}
