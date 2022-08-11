import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import algosdk from 'algosdk';
import { ADDRCONFIG } from 'dns';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient } from 'src/app/services/utils.algod';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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

  constructor(
    private userService: UserService,
    private connectService: WalletsConnectService,
    private _stateService: StateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseProfile();
      }
    });
  }

  ngOnInit(): void {
  }

  initialiseProfile() {
    const routeParams = this.route.snapshot.paramMap
    console.log(routeParams)
    const addr = routeParams.get('wallet')
    if(addr) {
      let walletAddress = addr
      if(algosdk.isValidAddress(walletAddress)){
        console.log("address detected")
            
        this.userService.loadProfile(walletAddress).subscribe(
          (res: any) => {
            this.userProfile = res
            console.log(this.userProfile)
            this.userService.loadCollections(walletAddress).subscribe(
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
        this.userService.loadProfileByCustomUrl(walletAddress).subscribe(
          (res: any) => {
            this.userProfile = res
            console.log(this.userProfile)
            walletAddress = this.userProfile.wallet
            this.userService.loadCollections(walletAddress).subscribe(
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
          }, error => {
            alert("No Profile found with this URL")
            this.router.navigateByUrl("home")
          }
        )
      }
     
      let wallet = this.connectService.sessionWallet
        if(wallet) {
          let connectedWallet = wallet.getDefaultAccount()
          if(connectedWallet == walletAddress) {
            this.isOwnProfile = true
          } else {
            this.isOwnProfile = false
          }
        }
        console.log(this.isOwnProfile)

      this.userService.loadUserOwnedAssets(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.ownedAssets = res
        }
      )

      this.userService.loadUserCreatedAssets(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.createdAssets = res
        }
      )

      this.userService.loadTrades(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.forSale = res
        }
      )

      this.userService.loadAuctionsWithMyBids(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.myAuctionBids = res
        }
      )

      this.userService.loadSwaps(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.forSwap = res
        }
      )

      this.userService.loadAuctions(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.forAuction = res
        }
      )

      this.userService.loadBids(walletAddress).subscribe(
        (res: any) => {
          console.log(res)
          this.myBids = res
        }
      )

      this.userService.loadStarredAssets(walletAddress).subscribe(
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
}
