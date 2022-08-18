import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getBalance, getUUID } from 'src/app/services/utils.algod';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss']
})
export class CreateAuctionComponent implements OnInit {

  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 0;
  public selectedAssetID = 0;
  public selectedAsset: any = {};
  public selectedAssetDescription = "";
  public selectedAssetDecimals = 0;

  public metadata: any = {};
  public metadataProperties: any = {};
  public price = 0;
  public assetAmount = 0;
  public minimumIncrement = 0;
  public startTime = "";
  public endTime = "";
  public assetsName: any[] = [];

  metadataAttributes: any;
  selectedAssetTotal: number = 0;

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
    this.spinner.hide()
    const firstAsset = this.assets[0];

    this.onSelectedAsset(firstAsset.index);
  }

  async onSelectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    this.spinner.show()
    const asset = this.getAsset(assetID);
    this.selectedAsset = asset;
    console.log(asset);

    this.selectedAssetDecimals = asset['params']['decimals']
    this.selectedAssetTotal = asset['params']['total']

    if(this.selectedAssetDecimals == 0 && this.selectedAssetTotal == 1) {
      this.assetAmount = 1
    } else {
      this.assetAmount = 0
    }

    if (asset.params.url) {
      await this.getMetadata(asset.params.url)
    } else {
      this.metadata = {}
    }
    console.log('metadata', this.metadata);
    this.spinner.hide()
    this.selectedAssetDescription = this.metadata.description ? this.metadata.description : '';
    this.setMaxSupply(+assetID);
  }

  async getMetadata(ipfsUrl: string) {
    console.log(ipfsUrl)
    if (ipfsUrl.startsWith('ipfs://')) {
      let url = environment.ipfs_base + this.selectedAsset.params.url.split("/")[this.selectedAsset.params.url.split("/").length - 1]
      this.metadata = await this.httpClient.get(url).toPromise();
    } else if(this.selectedAsset.params.url.includes('https://')){
      this.metadata = await this.httpClient.get(this.selectedAsset.params.url).toPromise();
    } else {
      this.metadata = await this.httpClient.get('https://' + this.selectedAsset.params.url).toPromise();
    }

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

  blurPriceEvent(event: any) {
    this.price = Math.floor(event.target.value * Math.pow(10, 6));
    console.log(this.price);
  }

  blurAssetAmountEvent(event: any) {
    this.assetAmount = Math.floor(parseFloat(event.target.value) * Math.pow(10, this.selectedAsset.params.decimals));
    console.log(this.assetAmount);
  }

  blurMinimumIncrementEvent(event: any) {
    this.minimumIncrement = Math.floor(event.target.value * Math.pow(10, 6));
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

  async createAuction() {
    if (!this.selectedAssetID) {
      alert('Please select valid asset');
      return;
    }
    if (!this.assetAmount) {
      alert('Please input asset amount');
      return;
    }
    if (+this.price <= 1000) {
      alert('Reserve amount should be greater than 1000');
      return;
    }
    if (this.minimumIncrement < 1000) {
      alert('Please input minimun increament at least 1000');
      return;
    }
    if (!this.startTime) {
      alert('Please select start time');
      return;
    }
    if (!this.endTime) {
      alert('Please select start time');
      return;
    }
    const asset = this.getAsset('' + this.selectedAssetID);
    if (!asset) {
      alert('Please select a valid asset to auction');
      return;
    }

    console.log('auction start');
    this.spinner.show();
    this._userService.getAuctionIndex(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
      async (res) => {
        console.log('auctionIndex', res);
        const indexAddress = res.indexAddress;

        let result = await this._walletsConnectService.setupAuction(indexAddress, Number(this.selectedAssetID), res.optinPrice);
        if (result) {
          this._userService.optinAndRekeyToAuction(indexAddress).subscribe(
            (res) => {
              console.log('setup auction response: ', res);
              if (res) {
                this.sendCreateAuctionRequest(indexAddress);

              } else {
                this.spinner.hide();
                alert('Setup auction failed');
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

  async sendCreateAuctionRequest(indexAddress: string) {
    console.log('started creating auction');

    const params1 = {
      auctionIndex: indexAddress,
      assetID: this.selectedAssetID,
      amount: this.assetAmount,
      reserve: this.price,
      startTime: Date.parse(this.startTime) / 1000,
      endTime: Date.parse(this.endTime) / 1000,
      minimumIncrement: this.minimumIncrement,
    }
    const txID = await this._walletsConnectService.createAuction(params1);
    console.log('txID', txID);

    if (txID) {
      const params = {
        auctionId: txID,
        indexAddress,
        assetId: this.selectedAsset.index,
        amount: this.assetAmount,
        creatorWallet: this._walletsConnectService.sessionWallet?.getDefaultAccount(),
        startTime: Date.parse(this.startTime) / 1000,
        closingTime: Date.parse(this.endTime) / 1000,
        minimumBid: this.minimumIncrement,
        minimumPrice: this.price
      }
      console.log('params', params)

      this._userService.createAuction(params).subscribe(
        res => {
          this.spinner.hide();
          alert("Created auction successfully");
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
      alert("Failed creating auction on algorand network");
    }
  }

  async closeAuction(bidIndex: string) {
    console.log('start cancel auction');
    const result = await this._walletsConnectService.closeAuction(bidIndex);
    if (result) {
      this._userService.closeAuction(bidIndex).subscribe(
        res => {
          this.spinner.hide();
          alert("Successfully closed");
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
