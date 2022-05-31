import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';

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

  public royalty: string = "0";
  public amount: string = "0";
  public price: string = "0";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
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

  showAssetDetails(asset: any) {
    this.isMine = this.mSwap.offererWallet == this._walletsConnectService.sessionWallet?.getDefaultAccount();
    this.isOpen = this.mSwap.isOpen;

    console.log('masset', asset);
    this.selectedAssetDescription = `Name: ${asset.name} \nUnitName: ${asset.unitName}`;
    this.maxSupply = asset.supply;

    this.metaDataProperties = asset.properties;
  }

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
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
    this.router.navigateByUrl('/create-offer')
  }

}
