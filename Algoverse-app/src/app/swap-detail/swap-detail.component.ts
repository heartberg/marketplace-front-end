import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-swap-detail',
  templateUrl: './swap-detail.component.html',
  styleUrls: ['./swap-detail.component.scss']
})
export class SwapDetailComponent implements OnInit {

  public mSwap: any = null;
  public isOpen = false;
  public isMine = false;
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

  public amount: string = "0";
  public offeringAssetDecimals: number = 0;
  public acceptingAmount: string = "0";
  public acceptingAssetDecimals: number = 0;
  public price: string = "0";
  acceptingAssetSupply: number = 0;
  offeringAssetSupply: number = 0;

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
    const SwapIdFromRoute = routeParams.get('swapId');
    if (!SwapIdFromRoute) {
      this.router.navigateByUrl('items');
      return;
    }

    this._userService.loadSwapItem(SwapIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mSwap = res;
        const asset = this.mSwap.offeringAsset;
        this.showAssetDetails(asset);
      },
      error => console.log(error)
    )
  }

  async showAssetDetails(asset: any) {
    this.isMine = this.mSwap.offererWallet == this._walletsConnectService.sessionWallet?.getDefaultAccount();
    this.isOpen = this.mSwap.isOpen;

    let acceptingAssetInfo = await this._walletsConnectService.getAsset(this.mSwap.acceptingAsset.assetId);
    this.acceptingAssetDecimals = acceptingAssetInfo['params']['decimals']
    let offeringAssetInfo = await this._walletsConnectService.getAsset(this.mSwap.offeringAsset.assetId);
    this.offeringAssetDecimals = offeringAssetInfo['params']['decimals']
    this.offeringAssetSupply = offeringAssetInfo['params']['total'] / Math.pow(10, this.offeringAssetDecimals)
    this.acceptingAssetSupply = acceptingAssetInfo['params']['total'] / Math.pow(10, this.acceptingAssetDecimals)
    this.amount = (this.mSwap.offeringAmount / Math.pow(10, this.offeringAssetDecimals)).toFixed(this.offeringAssetDecimals)
    this.acceptingAmount = (this.mSwap.acceptingAmount / Math.pow(10, this.acceptingAssetDecimals)).toFixed(this.acceptingAssetDecimals)

    console.log('masset', asset);
    this.selectedAssetDescription = `Name: ${asset.name} \nUnitName: ${asset.unitName}`;
    this.maxSupply = asset.supply;

    this.metaDataProperties = asset.properties;
  }

  blurAmountEvent(event: any){
    this.amount = event.target.value;
    console.log(this.amount);``
  }

  blurPriceEvent(event: any){
    this.price = event.target.value;
    console.log(this.price);
  }

  async actionSwap() {
    if (!this._walletsConnectService.sessionWallet) {
      alert('Connect your wallet!');
      return;
    }

    if (this.isOpen) {
      if (this.isMine) {
        // cancel swap
        await this.cancelSwap()

      } else {
        // bid on swap
        await this.acceptSwap()
      }
    } else {
      if (this.isMine) {

      } else {

      }
    }
  }

  async cancelSwap() {
    const swapIndex = this.mSwap.indexAddress;
    console.log('start cancel swap:', swapIndex);
    const result = await this._walletsConnectService.cancelSwap(swapIndex);
    if (result) {
      this._userService.cancelSwap(this.mSwap.swapId).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully cancelled')
        },
        (error) => console.log('error', error)
      )
    }
  }

  async acceptSwap() {
    const swapIndex = this.mSwap.indexAddress;
    console.log('start accept swap');
    const result = await this._walletsConnectService.acceptSwap(swapIndex, this.mSwap.offererWallet);
    if (result) {
      this._userService.acceptSwap(this.mSwap.swapId, this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        (res) => {
          console.log('result', res);
          console.log('Successfully accepted')
        },
        (error) => console.log('error', error)
      )
    }
  }

  public actionBack() {
    this._location.back()
  }

}
