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

  public index: number = -1;
  public indexSecond: number = -1;
  isPopUpOpened: boolean = false;

  isStarred: boolean = false;
  

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _assetService: AssetService,
    private _location: Location
  ) {
  }

  async ngOnInit(): Promise<void> {
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
          this._userService.getAssetStar(wallet.getDefaultAccount(), this.mItem.assetId).subscribe(
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
        
      },
      error => console.log(error)
    )
  }

  async showAssetDetails(asset: any) {
    let assetInfo = await this._walletsConnectService.getAsset(asset.assetId)
    this.assetName = asset.name;
    this.selectedAssetDescription = `Name: ${asset.name} \nUnitName: ${asset.unitName}`;
    console.log('selectedAssetDescription', this.selectedAssetDescription)
    this.decimals = assetInfo['params']['decimals'];
    this.maxSupply = +asset.supply / Math.pow(10, this.decimals);
    this.amount = this.mItem.amount;
    this.metaDataProperties = asset.properties;
    this.creatorName = this.mItem.creator.name;
    this.assetUnit = asset.unitName;
  }

  async acceptBid() {
    const BidIndex = this.mItem.bids[this.index].indexAddress;
    console.log('start accept Bid');
    const result = await this._walletsConnectService.acceptBid(BidIndex, this.mItem.bids[this.index].creatorWallet);
    if (result) {
      this._userService.acceptBid(this.mItem.bids[this.index].bidId, this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully accepted')
        },
        (error) => console.log('error', error)
      )
    }
  }

  async cancelBid() {
    const bidIndex = this.mItem.bids[this.index].indexAddress;
    console.log('start cancel Bid');
    const result = await this._walletsConnectService.cancelBid(bidIndex);
    if (result) {
      this._userService.cancelBid(bidIndex).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully cancelled')
        },
        (error) => console.log('error', error)
      )
    }
  }

  async cancelTrade() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }
    const tradeIndex = this.mItem.openTrades[this.indexSecond].indexAddress;
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelTrade(tradeIndex);
    if (result) {
      this._userService.cancelTrade(this.mItem.openTrades[this.indexSecond].tradeId).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully cancelled')
        },
        (error) => console.log('error', error)
      )
    }
  }
 
  async acceptTrade() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }
    const tradeIndex = this.mItem.openTrades[this.indexSecond].indexAddress;
    console.log('start accept trade');
    const result = await this._walletsConnectService.acceptTrade(tradeIndex, this.mItem.openTrades[this.indexSecond].creatorWallet);
    if (result) {
      this._userService.acceptTrade(this.mItem.openTrades[this.indexSecond].tradeId, this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully accepted')
        },
        (error) => console.log('error', error)
      )
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

  selectBtn() {
    this.isPopUpOpened = true;
  }

  closePopUp($event: boolean) {
    this.isPopUpOpened = $event;
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

  scaleAmount(amount: number) {
    return amount / Math.pow(10, this.decimals)
  }

  scaleAlgo(algo: number) {
    return algo / Math.pow(10, 6)
  }

  addStar() {
    let wallet = this._walletsConnectService.sessionWallet
    if(wallet) {
      const params = {
        assetId: this.mItem.assetId,
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
      this._userService.removeAssetStar(this.assetStar.assetStarId).subscribe(
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
