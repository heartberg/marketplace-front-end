import { Component, Input, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, getBalance, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';
import {Asset} from "algosdk/dist/types/src/client/v2/algod/models/types";
import {AssetService} from "../services/asset.service";
import {Location} from '@angular/common';
import { removeUndefinedProperties } from 'algosdk/dist/types/src/utils/utils';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-trade-detail',
  templateUrl: './trade-detail.component.html',
  styleUrls: ['./trade-detail.component.scss']
})
export class TradeDetailComponent implements OnInit {

  public mItem: any = null;
  public assetStar: any;

  public isOpen = false;
  public assetName: string = ""
  public assetUnit: string = ""
  public creatorName: string = ""
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

  public amount: string = "0";
  public price: string = "0";
  public decimals: number = 0;
  public total: number = 0;

  public index: number = -1;
  public indexSecond: number = -1;
  isPopUpOpened: boolean = false;

  balance: number = 0;
  isStarred: boolean = false;
  public animation_url: string = "";
  public animation_url_mimetype: string = "";
  public isMimeTypeVideo: boolean = false;
  public isMimeTypeAudio: boolean = false;
  public createTrade: boolean = false;
  assetInfo: any;


  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _assetService: AssetService,
    private _location: Location,
    private spinner: NgxSpinnerService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isPopUpOpened = false;
    const routeParams = this.route.snapshot.paramMap;
    const itemIdFromRoute = routeParams.get('itemId');
    console.log(itemIdFromRoute)
    if (!itemIdFromRoute) {
      this._location.back();
      return;
    }

    this._assetService.getAssetDetail(itemIdFromRoute).subscribe(
      async res => {
        console.log('res', res);
        this.mItem = res;
        await this.showAssetDetails(this.mItem);
        let wallet = this._walletsConnectService.sessionWallet
        if(wallet) {
          this.balance = await getBalance(wallet.getDefaultAccount(), this.mItem.assetId);
          let client = getAlgodClient()
          this._userService.getAssetStar(wallet.getDefaultAccount(), this.mItem.assetId).subscribe(
            (res: any) => {
              if(res) {
                this.assetStar = res;
                this.isStarred = true;
              } else {
                this.assetStar = undefined;
                this.isStarred = false;
              }
              this.spinner.hide();
            }, error => {
              this.spinner.hide();
              this.isStarred = false;
              this.assetStar = undefined;
            }
          )
        } else {
          this.spinner.hide();
        }
        this.receiveAssetCover(res.assetURL);
      },
      error => {
        this.spinner.hide();
        console.log(error)
      }
    )
  }

  async showAssetDetails(asset: any) {
    this.spinner.show();
    this.assetInfo = await this._walletsConnectService.getAsset(asset.assetId);
    this.spinner.hide();
    this.assetName = asset.name;
    this.selectedAssetDescription = `Name: ${asset.name} \nUnitName: ${asset.unitName}`;
    console.log('selectedAssetDescription', this.selectedAssetDescription)
    this.decimals = this.assetInfo['params']['decimals'];
    this.total = this.assetInfo['params']['total']
    console.log(this.decimals)
    console.log(this.total)
    this.maxSupply = +asset.supply / Math.pow(10, this.decimals);
    this.amount = this.mItem.amount;
    this.metaDataProperties = asset.properties;
    this.creatorName = this.mItem.creator.name;
    this.assetUnit = asset.unitName;
  }

  async acceptBid() {
    const BidIndex = this.mItem.bids[this.index].indexAddress;
    console.log('start accept Bid');
    this.spinner.show();
    const result = await this._walletsConnectService.acceptBid(BidIndex, this.mItem.bids[this.index].creatorWallet);
    if (result) {
      this._userService.acceptBid(this.mItem.bids[this.index].bidId, this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        (result) => {
          this.spinner.hide();
          alert("Successfully accepted bid!")
          console.log('result', result);
          console.log('Successfully accepted')
        },
        (error) => {
          this.spinner.hide();
          alert("Failed to accept bid!")
          console.log('error', error)
        }
      )
    } else {
      this.spinner.hide();
    }
  }

  async cancelBid() {
    const bidIndex = this.mItem.bids[this.index].indexAddress;
    console.log('start cancel Bid');
    this.spinner.show();
    const result = await this._walletsConnectService.cancelBid(bidIndex);
    if (result) {
      this._userService.cancelBid(bidIndex).subscribe(
        (result) => {
          this.spinner.hide();
          alert("Cancelled bid!")
          console.log('result', result);
          console.log('Successfully cancelled')
          this.mItem.bids.splice(this.index, this.index+1)
        },
        (error) => {
          this.spinner.hide();
          alert("error cancelling bid!")
          console.log('error', error)
        }
      )
    } else {
      this.spinner.hide();
    }
  }

  async cancelTrade() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }
    this.spinner.show();
    const tradeIndex = this.mItem.openTrades[this.indexSecond].indexAddress;
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelTrade(tradeIndex);
    if (result) {
      this._userService.cancelTrade(this.mItem.openTrades[this.indexSecond].tradeId).subscribe(
        (result) => {
          this.spinner.hide();
          alert("Cancelled trade!")
          console.log('result', result);
          console.log('Successfully cancelled')
          this.mItem.openTrades.splice(this.indexSecond, this.indexSecond+1)
        },
        (error) => {
          this.spinner.hide();
          alert("Failed to cancel trade!")
          console.log('error', error)
        }
      )
    } else {
      this.spinner.hide();
    }
  }

  async acceptTrade() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }
    this.spinner.show();
    const tradeIndex = this.mItem.openTrades[this.indexSecond].indexAddress;
    console.log('start accept trade');
    const result = await this._walletsConnectService.acceptTrade(tradeIndex, this.mItem.openTrades[this.indexSecond].tradeCreator.wallet);
    if (result) {
      this._userService.acceptTrade(this.mItem.openTrades[this.indexSecond].tradeId, this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        (result) => {
          this.spinner.hide();
          alert("Accepted trade!")
          console.log('result', result);
          console.log('Successfully accepted')
        },
        (error) => {
          alert("Failed to accept trade!")
          console.log('error', error)
          this.spinner.hide();
        }
      )
    } else {
      this.spinner.hide();
    }
  }

  public actionBack() {
    this._location.back()
  }

  select(item: any, i: any) {
    const index = i;
    if (this.index === index) {
      this.index = -1;
    } else {
      this.index = index;
    }
    if (this.index !== -1) {
      this.indexSecond = -1;
    }
    localStorage.setItem('asset', JSON.stringify(item));
  }

  selectSecond(item: any, i: any) {
    const index = i;
    if (this.indexSecond === index) {
      this.indexSecond = -1;
    } else {
      this.indexSecond = index;
    }
    if (this.indexSecond !== -1) {
       this.index = -1;
    }
    localStorage.setItem('asset', JSON.stringify(item));
  }

  createBid() {
    this.createTrade = false;
    this.isPopUpOpened = true;
  }

  createSale() {
    this.createTrade = true;
    this.isPopUpOpened = true;
  }

  closePopUp($event: boolean) {
    this.isPopUpOpened = $event;
    console.log("closing popup")
    
  }

  isMine(isBid: boolean, index: number): boolean {
    if(isBid) {
      if(this.mItem.bids[index].biddingUser.wallet == this._walletsConnectService.sessionWallet?.getDefaultAccount()) {
        return true;
      } else {
        return false;
      }
    } else {
      if(this.mItem.openTrades[index].tradeCreator.wallet == this._walletsConnectService.sessionWallet?.getDefaultAccount()) {
        return true;
      } else {
        return false;
      }
    }
  }

  isAssetMine(): boolean {
    return this.mItem.creator.wallet === this._walletsConnectService.sessionWallet?.getDefaultAccount();
  }

  scaleAmount(amount: number) {
    return amount / Math.pow(10, this.decimals)
  }

  scaleAlgo(algo: number) {
    return algo / Math.pow(10, 6)
  }

  addOrRemoveStar(): void {
    let wallet = this._walletsConnectService.sessionWallet;
    if (this.isStarred) {
      return this.removeStar();
    }
    if(wallet) {
      const params = {
        assetId: this.mItem.assetId,
        wallet: wallet.getDefaultAccount()
      }
      this._userService.addAssetStar(params).subscribe(
        (value: any) => {
          console.log(value)
          this.isStarred = true;
          this.mItem.stars++;
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
          this.mItem.stars--;
          console.log("removed star")
        }
      )
    } else {
      alert("connect wallet")
    }
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

  public buyNow(): void {

  }

  formatFractions(decimals: number) {
    if(decimals < 5) {
      return Math.pow(10, decimals).toFixed(0)
    } else {
      return decimals
    }
  }

}
