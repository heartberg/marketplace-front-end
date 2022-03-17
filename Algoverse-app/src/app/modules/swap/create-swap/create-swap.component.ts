import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-swap',
  templateUrl: './create-swap.component.html',
  styleUrls: ['./create-swap.component.scss']
})
export class CreateSwapComponent implements OnInit {

  private selectedAssetID = 0;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public acceptAssetId = "0";
  public acceptAmount: string = "0";
  public collectionName: string = "";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    this.assets = await this._walletsConnectService.getOwnAssets();
    const asset_ids = [];
    for (let asset of this.assets) {
      asset_ids.push(asset.index);
    }
    this.assetIDs = asset_ids;

    if (this.assets.length > 0) {
      const firstAsset = this.assets[0];
      this.selectedAssetID = firstAsset.index;
      this.selectedAssetDescription = `Name: ${firstAsset.params.name} \nUnitName: ${firstAsset.params['unit-name']}`;

      if (firstAsset.params.url) {
        this._userService.loadMetaData(firstAsset.params.url).subscribe(
          (result) => {
            console.log(result);
            let properties: any = {};
            for (const [key, value] of Object.entries(result)) {
              properties[key] = JSON.stringify(value);
            }
            this.metaDataProperties = properties;
          },
          (error) => console.log('error', error)
        )
      }

    }
  }

  selectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    const asset = this.getAsset(assetID);
    console.log(asset);
    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
    this.maxSupply = asset.params.total;

    if (asset.params.url) {
      this._userService.loadMetaData(asset.params.url).subscribe(
        (result) => {
          console.log('result', result);
          let properties: any = {};
            for (const [key, value] of Object.entries(result)) {
              properties[key] = JSON.stringify(value);
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

  blurAmountEvent(event: any){
    this.amount = event.target.value;
    console.log(this.amount);
  }

  blurAcceptAssetIndexEvent(event: any){
    this.acceptAssetId = event.target.value;
    console.log(this.acceptAssetId);
  }

  blurAcceptAmountEvent(event: any){
    this.acceptAmount = event.target.value;
    console.log(this.acceptAmount);
  }

  createSwap() {
    this._userService.getSwapIndex(this._walletsConnectService.myAlgoAddress[0]).subscribe(
      async (res) => {
        console.log('tradeIndex', res);

        if (res.OptinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(res.IndexAddress, res.optinPrice);
          if (result) {
            this.sendCreateSwapRequest(res.IndexAddress);
          }
        } else {
          this.sendCreateSwapRequest(res.IndexAddress);
        }
      },
      (error) => console.log('error', error)
    );
  }

  async sendCreateSwapRequest(indexAddress: string) {
    const params1 = {
      assetID: this.selectedAssetID,
      amount: this.amount,
      acceptAssetIndex: this.acceptAssetId,
      acceptAssetAmount: this.acceptAmount,
      swapIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createSwap(params1);

    if (txID) {
      const params2 = {
        swapId: txID,
        indexAddress,
        offerAddress: this._walletsConnectService.myAlgoAddress[0],
        offerringAssetId: this.selectedAssetID,
        offerringAmount: this.amount,
        acceptingAssetId: this.acceptAssetId,
        acceptingAmount: this.acceptAmount,
        collectionInterestedIn: this.collectionName
      }
      this._userService.createSwap(params2).subscribe(
        res => {
          console.log(res)
        },
        error => console.log(error)
      );
    }
  }


}
