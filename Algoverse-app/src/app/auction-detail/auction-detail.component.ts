import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  public mAuction: any = {};
  public isMine = false;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetID = 0;
  public selectedAsset: any = {};
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};
  public price = 0;
  public assetAmount = 0;
  public minimumIncrement = 0;
  public startTime = "";
  public endTime = "";

  public royalty: string = "0";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    const routeParams = this.route.snapshot.paramMap;
    const auctionIdFromRoute = routeParams.get('auctionId');
    if (!auctionIdFromRoute) {
      this.router.navigateByUrl('items');
      return;
    }

    this._userService.loadAuctionItem(auctionIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mAuction = res;
        this.showAuctionDetail();
      },
      error => console.log(error)
    )

  }

  showAuctionDetail() {
    this.isMine = this.mAuction.creatorWallet == this._walletsConnectService.sessionWallet?.getDefaultAccount();
    this.selectedAsset = this.mAuction.asset;
    this.selectedAssetID = this.selectedAsset.index;
    this.selectedAssetDescription = `Name: ${this.selectedAsset.name} \nUnitName: ${this.selectedAsset.unitName}`;

    if (this.selectedAsset.assetURL) {
      this._userService.loadMetaData(this.selectedAsset.assetUrl).subscribe(
        (result) => {
          console.log(result);
          let properties: any = {};
          for (const [key, value] of Object.entries(result)) {
            if (typeof value === 'string' || value instanceof String)
              properties[key] = value;
          }
          this.metaDataProperties = properties;
        },
        (error) => console.log('error', error)
      )
    }
  }

  getAsset(assetID: string) {
    var result = this.assets.find(asset => {
      return asset.index == assetID
    });
    return result;
  }

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurPriceEvent(event: any) {
    this.price = event.target.value;
    console.log(this.price);
  }

  blurAssetAmountEvent(event: any) {
    this.assetAmount = event.target.value;
    console.log(this.assetAmount);
  }

  blurMinimumIncrementEvent(event: any) {
    this.minimumIncrement = event.target.value;
    console.log(this.minimumIncrement);
  }

  blurStartTimeEvent(event: any) {
    this.startTime = event.target.value;
    console.log(this.startTime);
  }

  blurEndTimeEvent(event: any) {
    this.endTime = event.target.value;
    console.log(this.endTime);
  }

  async cancelAuction() {
    console.log('start cancel trade:', this.mAuction.indexAddress);
    const result = await this._walletsConnectService.cancelAuction(this.mAuction.indexAddress);
    if (result) {
      this._userService.cancelAuction(this.mAuction.auctionId).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully cancelled')
        },
        (error) => console.log('error', error)
      )
    }
  }

  public actionBack() {
    this.router.navigateByUrl('/create-offer')
  }

}
