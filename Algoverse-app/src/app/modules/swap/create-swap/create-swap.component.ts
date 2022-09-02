import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getBalance, getUUID, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-swap',
  templateUrl: './create-swap.component.html',
  styleUrls: ['./create-swap.component.scss']
})
export class CreateSwapComponent implements OnInit {

  private offeringAssetId = 0;
  public offeringAsset: any = null;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public acceptingAssetDescription = "";

  public offerringMetadata: any = {};
  public offerringMetadataProperties: any = {};
  public acceptingMetadata: any = {};
  public acceptingMetadataProperties: any = {};

  public amount: string = "0";
  public acceptingAssetId = 0;
  public acceptingAsset: any = null;
  public acceptAmount: string = "0";
  public collectionName: string = "";
  acceptingMetadataAttributes: any;
  offeringMetadataAttributes: any;
  offeringAssetParams: any;
  public offeringAssetDecimals = 0;
  public acceptingAssetDecimals = 0;
  public acceptingAssetSupply = 0;
  public assetsName: any[] = [];
  public properties: any[] = [];
  offeringAssetTotal: number = 0;
  acceptingAssetTotal: number = 0;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
  }

  async ngOnInit(): Promise<void> {
    console.log('nginit')
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

    this.spinner.hide();

    const asset_ids = [];
    for (let asset of this.assets) {
      asset_ids.push(asset.index);
    }
    this.assetIDs = asset_ids;
    this.extractAssetsName();

    // const firstAsset = this.assets[0];
    // this.onSelectedAsset(firstAsset.index);
  }

  async onSelectedAsset(assetID: string) {
    this.offeringAssetId = +assetID;
    this.offeringAssetParams = await this._walletsConnectService.getAsset(+assetID);
    this.offeringAssetDecimals = this.offeringAssetParams['params']['decimals']
    this.offeringAssetTotal = this.offeringAssetParams['params']['total']

    if(this.offeringAssetDecimals == 0 && this.offeringAssetTotal == 1) {
      this.amount = "1"
    } else {
      this.amount = ""
    }

    this.spinner.show();

    const asset = this.getAsset(assetID);
    this.offeringAsset = asset;
    console.log(asset);

    this.maxSupply = await getBalance(this._walletsConnectService.sessionWallet!.getDefaultAccount(), +assetID) / Math.pow(10, this.offeringAssetDecimals);

    if (asset.params.url) {
      await this.getMetadataOffer(asset.params.url)
    } else {
      this.offerringMetadata = {}
    }
    console.log('offerringMetadata', this.offerringMetadata);
    this.spinner.hide();

    this.selectedAssetDescription = this.offerringMetadata.description ? this.offerringMetadata.description : `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;

  }

  async setMaxSupply(assetID: number) {
    this.maxSupply = await getBalance(this._walletsConnectService.sessionWallet!.getDefaultAccount(), assetID) / Math.pow(10, this.offeringAssetDecimals)
  }

  getAsset(assetID: string) {
    var result = this.assets.find(asset => {
      return asset.index == assetID
    });
    return result;
  }

  blurAmountOfferEvent(event: any) {
    this.amount = (parseFloat(event.target.value) * Math.pow(10, this.offeringAsset.params.decimals)).toFixed(0);
    console.log(this.amount);
  }

  async blurAcceptAssetIndexEvent(event: any) {
    this.acceptingAssetId = +event.target.value;
    this.spinner.show();
    const asset = await this._walletsConnectService.getAsset(this.acceptingAssetId);
    if (!asset) {
      alert('Invalid Asset to accept');
      this.spinner.hide();
      this.acceptingAssetId = 0;
      return;
    }
    this.acceptingAsset = asset;
    console.log("accepting", this.acceptingAsset)
    this.acceptingAssetDecimals = this.acceptingAsset['params']['decimals']
    this.acceptingAssetSupply = this.acceptingAsset['params']['total'] / Math.pow(10, this.acceptingAssetDecimals)
    this.acceptingAssetTotal = this.acceptingAsset['params']['total']

    if(this.acceptingAssetDecimals == 0 && this.acceptingAssetTotal == 1) {
      this.acceptAmount = "1"
    } else {
      this.acceptAmount = ""
    }

    if (asset.params.url) {
      await this.getMetadataAccepting(asset.params.url)
    } else {
      this.acceptingMetadata = {}
      this.acceptingMetadataProperties = {}
    }
    console.log('acceptingMetadata', this.acceptingMetadata);
    this.spinner.hide();

    this.acceptingAssetDescription = this.acceptingMetadata.description ? this.acceptingMetadata.description : `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
  }

  async getMetadataAccepting(ipfsUrl: string) {
    this.spinner.show();
    if (ipfsUrl.includes('ipfs://')) {
      let url = environment.ipfs_base + this.acceptingAsset.params.url.split("/")[this.acceptingAsset.params.url.split("/").length - 1]
      this.acceptingMetadata = await this.httpClient.get(url).toPromise();
    } else if(this.acceptingAsset.params.url.includes('https://')){
      this.acceptingMetadata = await this.httpClient.get(this.acceptingAsset.params.url).toPromise();
    } else {
      this.acceptingMetadata = await this.httpClient.get('https://' + this.acceptingAsset.params.url).toPromise();
    }

    this.spinner.hide();
    const metaDataProperties: any = {}

    if (this.acceptingMetadata.properties) {
      Object.entries(this.acceptingMetadata.properties).forEach(([key, value]) => {
        metaDataProperties[key] = value;
      });
    }
    this.acceptingMetadataProperties = metaDataProperties?.properties;
    this.acceptingMetadataAttributes = metaDataProperties?.attributes;
  }

  async getMetadataOffer(ipfsUrl: string) {
    this.spinner.show();
    if (ipfsUrl.includes('ipfs://')) {
      let url = environment.ipfs_base + this.offeringAsset.params.url.split("/")[this.offeringAsset.params.url.split("/").length - 1]
      this.offerringMetadata = await this.httpClient.get(url).toPromise();
    } else if(this.offeringAsset.params.url.includes('https://')){
      this.offerringMetadata = await this.httpClient.get(this.offeringAsset.params.url).toPromise();
    } else {
      this.offerringMetadata = await this.httpClient.get('https://' + this.offeringAsset.params.url).toPromise();
    }

    this.spinner.hide();
    const metaDataProperties: any = {}

    if (this.offerringMetadata.properties) {
      Object.entries(this.offerringMetadata.properties).forEach(([key, value]) => {
        metaDataProperties[key] = value;
      });
    }
    this.offerringMetadataProperties = metaDataProperties?.properties;
    this.offeringMetadataAttributes = metaDataProperties?.attributes;
  }

  blurAcceptAmountEvent(event: any) {
    this.acceptAmount = (parseFloat(event.target.value) * Math.pow(10, this.acceptingAsset.params.decimals)).toFixed(0);
    console.log(this.acceptAmount);
  }

  createSwap() {
    if (!this._walletsConnectService.sessionWallet!.getDefaultAccount()) {
      return;
    }
    if (!this.offeringAsset) {
      alert('Select valid offering asset');
      return;
    }
    if (!this.acceptingAsset) {
      alert('Select valid acceting asset');
      return;
    }
    if (!+this.amount) {
      alert('Invalid offering amount');
      return;
    }
    if (+this.amount > (this.maxSupply * Math.pow(10, this.offeringAssetDecimals))) {
      console.log(+this.amount, this.maxSupply)
      alert('Offering amount to high');
      return;
    }
    if (!+this.acceptAmount) {
      alert('Invalid accepting amount');
      return;
    }
    if(+this.acceptAmount > (this.acceptingAssetSupply * Math.pow(10, this.acceptingAssetDecimals))) {
      alert('Accept amount to high');
      return;
    }

    console.log('start create swap');
    this.spinner.show();
    this._userService.getSwapIndex(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
      async (res) => {
        console.log('swapIndex', res);
        const indexAddress = res.indexAddress;
        let result = await this._walletsConnectService.setupSwap(indexAddress, Number(this.offeringAssetId), Number(this.acceptingAssetId), res.optinPrice);
        if (result) {
          this._userService.optinAndRekeyToSwap(indexAddress).subscribe(
            (res) => {
              console.log('setup swap response: ', res);
              if (res) {
                this.sendCreateSwapRequest(indexAddress);

              } else {
                this.spinner.hide();
                alert('Setup swap failed');
              }
            },
            (err) => {
              this.spinner.hide();
              console.log('err', err);
              alert('Network error, please try again later');
            }
          )
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
        alert('Network error, please try again later');
        console.log('error', error)
      }
    );
  }

  async sendCreateSwapRequest(indexAddress: string) {
    const params1 = {
      assetID: this.offeringAssetId,
      amount: this.amount,
      acceptAssetIndex: this.acceptingAssetId,
      acceptAssetAmount: this.acceptAmount,
      swapIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createSwap(params1);

    if (txID) {
      const params2 = {
        swapId: txID,
        indexAddress,
        offerAddress: this._walletsConnectService.myAlgoAddress[0],
        offeringAssetId: this.offeringAssetId,
        offeringAmount: this.amount,
        acceptingAssetId: this.acceptingAssetId,
        acceptingAmount: this.acceptAmount,
        collectionInterestedIn: this.collectionName
      }

      console.log('param', params2);
      this._userService.createSwap(params2).subscribe(
        res => {
          this.spinner.hide();
          alert('Successfully created');
          console.log(res);
        },
        error => {
          this.spinner.hide();
          console.log(error);
          console.log('Network error, please try again later');
        }
      );
    } else {
      this.spinner.hide();
      alert("Failed creating swap on algorand network");
    }
  }

  async cancelSwap(swapIndex: string) {
    this.spinner.show();
    const result = await this._walletsConnectService.cancelSwap(swapIndex);
    if (result) {
      this._userService.cancelSwap(swapIndex).subscribe(
        res => {
          this.spinner.hide();
          alert('Successfully cancelled');
          console.log(res);
        },
        error => {
          this.spinner.hide();
          console.log(error);
          console.log('Network error, please try again later');
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
      this.assetsName.unshift({
        id: 0,
        name: "Select asset"
      })
    }
  }


}
