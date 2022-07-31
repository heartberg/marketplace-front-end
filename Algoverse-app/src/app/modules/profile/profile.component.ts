import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';
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
    let wallet = this.connectService.sessionWallet
    if(wallet) {
      let connectedWallet = wallet.getDefaultAccount()
      if(connectedWallet == addr) {
        this.isOwnProfile = true
      } else {
        this.isOwnProfile = false
      }
    }
    console.log(this.isOwnProfile)
    if(addr) {
      this.userService.loadProfile(addr).subscribe(
        (res: any) => {
          this.userProfile = res
          console.log(this.userProfile)
          this.userService.loadCollections(addr).subscribe(
            (collections: any) => {
              this.userCollections = collections
              this._stateService.collections = res;
            }
          )
        }
      )

      this.userService.loadTrades(addr).subscribe(
        (res: any) => {
          console.log(res)
          this.forSale = res
        }
      )

      this.userService.loadAuctionsWithMyBids(addr).subscribe(
        (res: any) => {
          console.log(res)
          this.myAuctionBids = res
        }
      )

      this.userService.loadSwaps(addr).subscribe(
        (res: any) => {
          console.log(res)
          this.forSwap = res
        }
      )

      this.userService.loadAuctions(addr).subscribe(
        (res: any) => {
          console.log(res)
          this.forAuction = res
        }
      )

      this.userService.loadBids(addr).subscribe(
        (res: any) => {
          console.log(res)
          this.myBids = res
        }
      )

      this.userService.loadStarredAssets(addr).subscribe(
        (res: any) => {
          console.log(res);
          this.starred = res
        }
      )
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
