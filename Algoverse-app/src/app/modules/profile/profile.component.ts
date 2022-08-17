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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [Location]
})
export class ProfileComponent implements OnInit, OnDestroy{
  profileTitle: string = 'Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM '
  profileImg: string = 'https://www.annualreviews.org/pb-assets/journal-home/special-collections/collection-archive-extreme-weather-2021-1630444709857.png'
  public exampleArr:any = [];
  userProfile: any;
  userCollections: any;
  ownedAssets: any;
  createdAssets: any;
  forSale: any;
  forSwap: any;
  forAuction: any;
  myBids: any;
  myAuctionBids: any;
  swapRequests: any;
  starred: any;
  isOwnProfile: boolean = false;
  navigationSubscription: any;
  public isTruncated: boolean = true;
  public following: any;
  public showFollowers = false;
  public popupOpen = false;
  public walletAddress = "";

  constructor(
    private userService: UserService,
    private connectService: WalletsConnectService,
    private _stateService: StateService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly location: Location,
    private spinner: NgxSpinnerService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseProfile();
      }
    });
  }

  ngOnInit(): void {
    this.detectOwnProfile(this.connectService.sessionWallet);
  }

  initialiseProfile() {
    const routeParams = this.route.snapshot.paramMap
    console.log(routeParams)
    const addr = routeParams.get('wallet')
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
            this.userService.loadCollections(this.walletAddress).subscribe(
              (collections: any) => {
                this.userCollections = collections
                this._stateService.collections = res;
              }
            )
            wallet = this.connectService.sessionWallet
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
          }
        )
      } else {
        this.userService.loadProfileByCustomUrl(addr).subscribe(
          (res: any) => {
            this.userProfile = res
            console.log(this.userProfile)
            this.walletAddress = this.userProfile.wallet
            this.userService.loadCollections(this.walletAddress).subscribe(
              (collections: any) => {
                this.userCollections = collections
                this._stateService.collections = res;
              }
            )
            wallet = this.connectService.sessionWallet
            this.detectOwnProfile(wallet);
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

      let wallet = this.connectService.sessionWallet;
      this.detectOwnProfile(wallet);

      this.userService.loadUserOwnedAssets(this.walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.ownedAssets = res
        }
      )

      this.userService.loadUserCreatedAssets(this.walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.createdAssets = res
        }
      )

      console.log('user wallet', this.walletAddress);
      // this.spinner.show();
      // this.userService.syncUserAssets(this.walletAddress).subscribe(
      //   (res: any) => {
      //     console.log(res)
      //     this.spinner.hide();
      //     this.createdAssets = res.created;
      //     this.ownedAssets = res.owned;
      //   }
      // )

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
    }
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
}
