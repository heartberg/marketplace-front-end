import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';
import {Location} from '@angular/common';
import { makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import { getAlgodClient, getAppGlobalState, getAppLocalStateByKey } from '../services/utils.algod';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  public mAuction: any = {};
  public assetStar: any;

  public isMine = false;
  public isFinished = false;
  public hasStarted = false;
  public canClose = false;
  public canCancel = false;
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
  public animation_url: string = "";
  public animation_url_mimetype: string = "";
  public isMimeTypeVideo: boolean = false;
  public isMimeTypeAudio: boolean = false;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private spinner: NgxSpinnerService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const routeParams = this.route.snapshot.paramMap;
    const auctionIdFromRoute = routeParams.get('auctionId');
    if (!auctionIdFromRoute) {
      this.router.navigateByUrl('items');
      return;
    }
    this.loadAuctionDetails(auctionIdFromRoute);
  }

  async showAuctionDetail() {
    this.isMine = this.mAuction.creatorWallet == this._walletsConnectService.sessionWallet?.getDefaultAccount();
    this.isOpen = this.mAuction.isOpen;

    let now = Math.floor(new Date().getTime() / 1000)

    this.startTime = this.formatDate(this.mAuction.startingDate)
    this.endTime = this.formatDate(this.mAuction.closingDate)

    this.isFinished = this.mAuction.closingDate < now
    this.hasStarted = this.mAuction.startingDate < now
    console.log("finished", this.isFinished)
    console.log("started", this.hasStarted)

    if(this.isOpen) {
      if(this.isMine && !this.hasStarted) {
        this.canCancel = true;
      } else if (this.isMine && this.isFinished) {
        this.canClose = true;
      } else {
        const client = getAlgodClient()
        let leadBidder = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, this.mAuction.indexAddress, "LB_ADDR")
        if (leadBidder && leadBidder == this._walletsConnectService.sessionWallet!.getDefaultAccount()) {
          console.log("I am lead bidder!")
          this.canClose = this.isFinished
        }
      }
    }
    
    this.selectedAsset = this.mAuction.asset;
    this.selectedAssetID = this.selectedAsset.assetId;
    this.selectedAssetDescription = `Name: ${this.selectedAsset.name} \nUnitName: ${this.selectedAsset.unitName}`;

    let assetInfo = await this._walletsConnectService.getAsset(this.mAuction.asset.assetId)
    this.decimals = assetInfo['params']['decimals']
    this.totalSupply = assetInfo['params']['total'] / Math.pow(10, this.decimals)
    this.price = this.mAuction.reserve / Math.pow(10, 6)
    if(this.mAuction.bids.length > 0) {
      this.minimumIncrement = this.mAuction.minimumBid / Math.pow(10, 6) + this.mAuction.bids[0].amount / Math.pow(10, 6)
    } else {
      this.minimumIncrement = this.mAuction.reserve / Math.pow(10, 6)
    }
    
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
    this.bidAmount = event.target.value * Math.pow(10, 6);
    console.log(this.bidAmount);
  }

  async actionAuction() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }

    if(this.bidAmount < this.minimumIncrement * Math.pow(10, 6)) {
      alert('Bid too low!');
      return;
    }

    if(!this.canClose && !this.canCancel && (!this.hasStarted || this.isFinished)){
      return;
    }

    console.log(this.canClose, this.canCancel, this.hasStarted)

    if (this.isOpen) {
      console.log("spinner")
      if (this.isMine) {
        if(this.canClose || this.canCancel) {
          // cancel auction
          await this.closeAuction()
        } else {
          await this.bidAuction()
        }
      } else {
        if(this.canClose) {
          await this.closeAuction()
        } else {
          // bid on auction
          await this.bidAuction()
        }
      }
    } else {
      if (this.isMine) {

      } else {

      }
    }
  }

  async closeAuction() {
    console.log('start close auction:', this.mAuction.indexAddress);
    this.spinner.show()
    const result = await this._walletsConnectService.closeAuction(this.mAuction.indexAddress);
    if (result) {
      this._userService.closeAuction(this.mAuction.auctionId).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully closed')
          this.spinner.hide()
          alert("successfully closed!")
        },
        (error) => {
          console.log('error', error)
          this.spinner.hide()
          alert("failed to close!")
          
        }
      )
    } else {
      this.spinner.hide()
    }
  }

  async bidAuction() {
    const auctionIndex = this.mAuction.indexAddress;
    console.log('start bidAuction', auctionIndex);
    this.spinner.show()
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
          this.spinner.hide()
          alert("Successful bid")
        },
        (error) => {
          console.log('error', error)
          this.spinner.hide()
          alert("failed to bid!")
        }
      )
    } else {
      this.spinner.hide()
    }
  }

  public actionBack() {
    this._location.back()
  }

  scaleAlgo(amount: number) {
    return amount / Math.pow(10, 6)
  }

  addOrRemoveStar(): void {
    let wallet = this._walletsConnectService.sessionWallet;
    if (this.isStarred) {
      return this.removeStar();
    }
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
          this.loadAuctionDetails(this.mAuction.auctionId)
        }
      )
    } else {
      alert("connect wallet")
    }

  }

  removeStar() {
    let wallet = this._walletsConnectService.sessionWallet
    if(wallet) {
      this._userService.removeAssetStar(this.assetStar.assetStarId).subscribe(
        (value: any) => {
          console.log(value)
          this.isStarred = false;
          this.mAuction.asset.stars--;
          this.loadAuctionDetails(this.mAuction.auctionId)
          console.log("removed star")
        }
      )
    } else {
      alert("connect wallet")
    }
  }

  private loadAuctionDetails(auctionIdFromRoute: string) {
    this._userService.loadAuctionItem(auctionIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mAuction = res;
        this.showAuctionDetail();
        let wallet = this._walletsConnectService.sessionWallet
        if(wallet) {
          this._userService.getAssetStar(wallet.getDefaultAccount(), this.selectedAssetID).subscribe(
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
        this.receiveAssetCover(res?.asset.assetURL);
      },
      error => console.log(error)
    )
  }

  public receiveAssetCover(assetURL: string): void {
    this._userService.receiveAssetInformation(assetURL).subscribe((response: any) => {
      this.animation_url = response.animation_url;
      this.animation_url_mimetype = response.animation_url_mimetype;
      this.detectAnimationType();
    }, error => {
      console.log(error)
    });
  }

  private detectAnimationType() {
    if (!this.animation_url_mimetype) {
      return;
    }
    if (this.animation_url_mimetype.includes("video")) {
      this.isMimeTypeVideo = true;
    }
    if (this.animation_url_mimetype.includes("audio")) {
      this.isMimeTypeAudio = true;
    }
  }

  formatDate(timestamp: number): string {
    let date = new Date(timestamp * 1000)
    //console.log(date)
    let minutes = date.getMinutes().toString()
    if(date.getMinutes() < 10) {
      minutes = "0" + minutes
    }
    let hours = date.getHours().toString()
    if(date.getHours() < 10){
      hours = "0" + hours
    }
    return date.toDateString() + " - " + hours + ":" + minutes
  }

  formatFractions(decimals: number) {
    if(decimals < 5) {
      return Math.pow(10, decimals).toFixed(0)
    } else {
      return decimals
    }
  }

}
