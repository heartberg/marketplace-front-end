import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  public mAuction: any = {};
  public assetStar: any;

  public isMine = false;
  public isOpen = true;
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
  public bidAmount = 0;
  public startTime = "";
  public endTime = "";
  public decimals = 0;
  public totalSupply = 0;

  public isStarred: boolean = false;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) {
  }

  async ngOnInit(): Promise<void> {
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

  async showAuctionDetail() {
    this.isMine = this.mAuction.creatorWallet == this._walletsConnectService.sessionWallet?.getDefaultAccount();
    this.isOpen = this.mAuction.isOpen;
    this.selectedAsset = this.mAuction.asset;
    this.selectedAssetID = this.selectedAsset.index;
    this.selectedAssetDescription = `Name: ${this.selectedAsset.name} \nUnitName: ${this.selectedAsset.unitName}`;

    let assetInfo = await this._walletsConnectService.getAsset(this.mAuction.asset.assetId)
    this.decimals = assetInfo['params']['decimals']
    this.totalSupply = assetInfo['params']['total'] / Math.pow(10, this.decimals)

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

  blurBidAmount(event: any) {
    this.bidAmount = event.target.value;
    console.log(this.bidAmount);
  }

  async actionAuction() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }

    if (this.isOpen) {
      if (this.isMine) {
        // cancel auction
        await this.closeAuction()

      } else {
        // bid on auction
        await this.bidAuction()
      }
    } else {
      if (this.isMine) {

      } else {

      }
    }
  }

  async closeAuction() {
    console.log('start cancel trade:', this.mAuction.indexAddress);
    const result = await this._walletsConnectService.closeAuction(this.mAuction.indexAddress);
    if (result) {
      this._userService.closeAuction(this.mAuction.auctionId).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully cancelled')
        },
        (error) => console.log('error', error)
      )
    }
  }

  async bidAuction() {
    const auctionIndex = this.mAuction.indexAddress;
    console.log('start bidAuction', auctionIndex);
    const result = await this._walletsConnectService.bidAuction(auctionIndex, this.bidAmount);
    if (result) {
      const params = {
        auctionId: this.mAuction.auctionId,
        auctionBidId: result,
        bidderWallet: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
        amount: this.bidAmount
      }
      console.log('params', params)
      this._userService.bidAuction(params).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully bid')
        },
        (error) => console.log('error', error)
      )
    }
  }

  public actionBack() {
    this._location.back()
  }

  addStar() {
    let wallet = this._walletsConnectService.sessionWallet
    if(wallet) {
      const params = {
        assetId: this.selectedAssetID,
        wallet: wallet.getDefaultAccount()
      }
      this._userService.addAssetStar(params).subscribe(
        (value: any) => {
          console.log(value)
          this.isStarred = true;
          console.log("added star")
        }
      )
    } else {
      alert("connect wallet")
    }

  }

  removeStar() {
    let wallet = this._walletsConnectService.sessionWallet
    if(wallet) {
      const params = {
        assetId: this.selectedAssetID,
        wallet: wallet.getDefaultAccount(),
        assetStarId: this.assetStar.assetStarId
      }
      this._userService.removeAssetStar(params).subscribe(
        (value: any) => {
          console.log(value)
          this.isStarred = false;
          console.log("removed star")
        }
      )
    } else {
      alert("connect wallet")
    }
  }

}
