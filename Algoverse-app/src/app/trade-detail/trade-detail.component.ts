import { Component, Input, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trade-detail',
  templateUrl: './trade-detail.component.html',
  styleUrls: ['./trade-detail.component.scss']
})
export class TradeDetailComponent implements OnInit {

  private mTrade: any = null;
  public isMine = false;
  public assetName: string = ""
  public assetUnit: string = ""
  public creatorName: string = ""
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
    const tradeIdFromRoute = routeParams.get('tradeId');
    if (!tradeIdFromRoute) {
      this.router.navigateByUrl('items');
      return;
    }

    this._userService.loadTradeItem(tradeIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mTrade = res;
        const asset = this.mTrade.asset;
        this.showAssetDetails(asset);
      },
      error => console.log(error)
    )
  }

  showAssetDetails(asset: any) {
    this.isMine = this.mTrade.creatorWallet == this._walletsConnectService.sessionWallet?.getDefaultAccount();
    console.log('masset', asset);
    this.assetName = asset.name;
    this.selectedAssetDescription = `Name: ${asset.name} \nUnitName: ${asset.unitName}`;
    console.log('selectedAssetDescription', this.selectedAssetDescription)
    this.maxSupply = asset.supply;
    this.amount = this.mTrade.amount;
    this.metaDataProperties = asset.properties;
    this.creatorName = this.mTrade.tradeCreator.name;
    this.assetUnit = asset.unitName;
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

  async cancelTrade() {
    const tradeIndex = this.mTrade.indexAddress;
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelTrade(tradeIndex);
    if (result) {
      this._userService.cancelTrade(this.mTrade.tradeId).subscribe(
        (result) => {
          console.log('result', result);
          console.log('Successfully cancelled')
        },
        (error) => console.log('error', error)
      )
    }
  }

  public actionBack() {
    this.router.navigateByUrl("/items");
  }

}
