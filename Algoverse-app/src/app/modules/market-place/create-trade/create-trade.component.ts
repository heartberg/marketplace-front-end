import { Component, Input, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, getBalance, getUUID, isOptinAsset } from 'src/app/services/utils.algod';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-trade',
  templateUrl: './create-trade.component.html',
  styleUrls: ['./create-trade.component.scss']
})
export class CreateTradeComponent implements OnInit {

  private selectedAssetID = 0;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 0;
  public selectedAssetDescription = "";
  public selectedAssetDecimals = 0;
  public chosenAsset: any;
  public chosenAssetParams: any;

  public metadata: any = {};
  public metadataProperties: any = {};

  public amount: string = "0";
  public price: string = "0";
  public metadataAttributes: any = {};
  public selectedAssetName: string = "";
  public assetsName: any[] = [];
  selectedAssetTotal: number = 0;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    this.spinner.show();
    this.assets = await this._walletsConnectService.getOwnAssets();

    if (this.assets.length == 0) {
      alert('You don\'t have any asset to swap, please create assets');
      this.router.navigate(['/', 'collection']);
      this.spinner.hide();
      return;
    }

    const asset_ids = [];
    for (let asset of this.assets) {
      asset_ids.push(asset.index);
    }
    this.assetIDs = asset_ids;
    this.extractAssetsName();

    const algod = getAlgodClient();
    const accountInfo = await algod.accountInformation('5V3RXJ76GKVG7F55LZIVN6DXOQLNRLAMMNQMFLJ57LP2PP5B7Q64A7IX7A').do();
    console.log('accountInfo 0 0 0 ', accountInfo);

    const firstAsset = this.assets[0];
    this.selectedAsset(firstAsset.index);

    this.spinner.hide()
  }

  async selectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    this.chosenAssetParams = await this._walletsConnectService.getAsset(+assetID)
    this.selectedAssetDecimals = this.chosenAssetParams['params']['decimals']
    this.selectedAssetTotal = this.chosenAssetParams['params']['total']

    if(this.selectedAssetDecimals == 0 && this.selectedAssetTotal == 1) {
      this.amount = "1"
    } else {
      this.amount = ""
    }

    this.chosenAsset = this.getAsset(assetID);
    console.log('asset', this.chosenAsset);

    if (this.chosenAsset.params.url) {
      await this.getMetadata(this.chosenAsset.params.url)
    }
    console.log('metadata', this.metadata);

    this.selectedAssetDescription = this.metadata.description ? this.metadata.description : "";

    this.selectedAssetName = this.chosenAsset.params.name
    this.setMaxSupply(+assetID);
  }

  async getMetadata(ipfsUrl: string) {
    this.spinner.show();
    if (ipfsUrl.includes('ipfs://')) {
      let url = environment.ipfs_base + this.chosenAsset.params.url.split("/")[this.chosenAsset.params.url.split("/").length - 1]
      this.metadata = await this.httpClient.get(url).toPromise();
    } else if(this.chosenAsset.params.url.includes('https://')){
      this.metadata = await this.httpClient.get(this.chosenAsset.params.url).toPromise();
    } else {
      this.metadata = await this.httpClient.get('https://' + this.chosenAsset.params.url).toPromise();
    }

    this.spinner.hide();

    const metaDataProperties: any = {}

    if (this.metadata.properties) {
      Object.entries(this.metadata.properties).forEach(([key, value]) => {
        metaDataProperties[key] = value;
      });
    }
    this.metadataProperties = metaDataProperties?.properties;
    this.metadataAttributes = metaDataProperties?.attributes;
  }

  async setMaxSupply(assetID: number) {
    this.maxSupply = await getBalance(this._walletsConnectService.sessionWallet!.getDefaultAccount(), assetID) / Math.pow(10, this.selectedAssetDecimals)
  }

  getAsset(assetID: string) {
    var result = this.assets.find(asset => {
      return asset.index == assetID
    });
    return result;
  }

  blurAmountEvent(event: any) {
    this.amount = (parseFloat(event.target.value) * Math.pow(10, this.chosenAsset.params.decimals)).toFixed(0);
    console.log(this.amount);
  }

  blurPriceEvent(event: any) {
    this.price = (parseFloat(event.target.value) * Math.pow(10, 6)).toFixed(0);
    console.log(this.price);
  }

  async createTrade() {
    if (!this.selectedAssetID) {
      alert('Please select valid asset');
      return;
    }
    if (+this.price < 1000) {
      alert('Please input price at least 0.001');
      return;
    }
    if (!this.amount) {
      alert('Please input amount');
      return;
    }
    if (+this.amount / Math.pow(10, this.selectedAssetDecimals) > this.maxSupply) {
      alert('Please input amount smaller then max supply');
      return;
    }
    const asset = this.getAsset('' + this.selectedAssetID);
    if (!asset) {
      alert('Please select a valid asset to auction');
      return;
    }

    console.log(this.amount)

    console.log('trade start');
    this.spinner.show();
    this._userService.getTradeIndex(this._walletsConnectService.myAlgoAddress[0]).subscribe(
      async (res) => {
        console.log('tradeIndex', res);
        const indexAddress = res.indexAddress;
        let result = await this._walletsConnectService.setupTrade(indexAddress, Number(this.selectedAssetID), res.optinPrice);
        if (result) {
          this._userService.optinAndRekeyToTrade(indexAddress).subscribe(
            (res) => {
              console.log('optin and rekey response: ', res);
              if (res) {
                this.sendCreateTradeRequest(indexAddress);

              } else {
                this.spinner.hide();
                alert('Setup trade failed');
              }
            },
            (err) => {
              this.spinner.hide();
              console.log('optin and rekey error: ' + err);
              alert('Network error, please try again later');
            }
          );
        } else {
          this.spinner.hide();
          if (result === 0) {
            alert("Insufficient balance");
          } else {
            alert("Exception occurred, please retry again later");
          }
        }
      },
      (error) => {
        this.spinner.hide();
        alert("Network error, please try again later");
        console.log('error', error)
      }
    );
  }

  async sendCreateTradeRequest(indexAddress: string) {
    const params1 = {
      assetID: this.selectedAssetID,
      amount: this.amount,
      price: this.price,
      tradeIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createTrade(params1);

    if (txID) {
      const params2 = {
        tradeId: txID,
        assetId: this.selectedAssetID,
        indexAddress,
        price: this.price,
        creatorWallet: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
        amount: this.amount
      }
      console.log('params2', params2);
      this._userService.createTrade(params2).subscribe(
        res => {
          this.spinner.hide();
          alert("Created trade successfully");
          console.log(res)
        },
        error => {
          this.spinner.hide();
          alert(error);
          console.log(error)
        }
      );
    } else {
      this.spinner.hide();
      alert("Failed creating trade on algorand network");
    }
  }

  async cancelTrade(tradeIndex: string) {
    console.log('start cancel trade');
    this.spinner.show();
    const result = await this._walletsConnectService.cancelTrade(tradeIndex);
    if (result) {
      this._userService.cancelTrade(tradeIndex).subscribe(
        res => {
          this.spinner.hide();
          alert("Successfully cancelled");
          console.log(res)
        },
        error => {
          this.spinner.hide();
          alert(error);
          console.log(error)
        }
      );
    } else {
      this.spinner.hide();
      alert("Failed cancel");
    }
  }

  public actionBack() {
    this._location.back();
  }

  private extractAssetsName() {
    if (this.assets.length) {
      this.assetsName = this.assets.map(asset => {
        return {
          id: asset.index.toString(),
          name: asset.params.name
        }
      });
    }
  }
}
