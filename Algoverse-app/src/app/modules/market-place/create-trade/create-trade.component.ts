import { Component, Input, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, getBalance, getUUID, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

  public metadata: any = {};
  public metadataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public price: string = "0";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private httpClient: HttpClient,
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

    const algod = getAlgodClient();
    const accountInfo = await algod.accountInformation('5V3RXJ76GKVG7F55LZIVN6DXOQLNRLAMMNQMFLJ57LP2PP5B7Q64A7IX7A').do();
    console.log('accountInfo 0 0 0 ', accountInfo);

    if (this.assets.length > 0) {
      const firstAsset = this.assets[0];
      this.selectedAsset(firstAsset.index);
    }
  }

  async selectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;
    this.setMaxSupply(+assetID);

    const asset = this.getAsset(assetID);
    console.log('asset', asset);

    if (asset.params.url) {
      if (asset.params.url.includes('https://') || asset.params.url.includes('http://')) {
        this.metadata = await this.httpClient.get(asset.params.url).toPromise();
      } else {
        this.metadata = await this.httpClient.get('https://' + asset.params.url).toPromise();
      }
    }
    console.log('metadata', this.metadata);

    this.selectedAssetDescription = this.metadata.description ? this.metadata.description : `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;

    let properties: any = {};
    if (this.metadata.properties) {
      for (const [key, value] of Object.entries(this.metadata.properties)) {
        if (typeof value === 'string' || value instanceof String)
          properties[key] = value;
      }
    }
    this.metadataProperties = properties;
  }

  async setMaxSupply(assetID: number) {
    this.maxSupply = await getBalance(this._walletsConnectService.sessionWallet!.getDefaultAccount(), assetID)
  }

  getAsset(assetID: string) {
    var result = this.assets.find(asset => {
      return asset.index == assetID
    });
    return result;
  }

  blurRoyaltyEvent(event: any) {
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurAmountEvent(event: any) {
    this.amount = event.target.value;
    console.log(this.amount);
  }

  blurPriceEvent(event: any) {
    this.price = event.target.value;
    console.log(this.price);
  }

  async createTrade() {
    // let result = await this._walletsConnectService.payToSetUpIndex('4TT75274EBUAF46CITUL6HQQ4C4D3GO7GEOVRZSQZ35VXSGRVHJ376GD64', 1);
    // console.log(result);

    if (!this.selectedAssetID) {
      alert('Please select valid asset');
      return;
    }
    if (+this.price < 1000) {
      alert('Please input price at least 1000');
      return;
    }
    if (!this.amount) {
      alert('Please input amount');
      return;
    }
    if (+this.amount > this.maxSupply) {
      alert('Please input amount at least 1000');
      return;
    }
    if (!this.royalty) {
      alert('Please input royalty');
      return;
    }

    console.log('trade start');
    this._userService.getTradeIndex(this._walletsConnectService.myAlgoAddress[0], this.selectedAssetID).subscribe(
      async (res) => {
        console.log('tradeIndex', res);

        const indexAddress = res.indexAddress;
        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          console.log('paid index address result', result)
          if (result) {
            this._userService.setupTrade(indexAddress, this.selectedAssetID).subscribe(
              (res) => {
                console.log('setup trade response: ', res);
                if (res) {
                  this.sendCreateTradeRequest(indexAddress);
                } else {
                  console.log('setup trade failed');
                }
              },
              (err) => {
                console.log('setup trade error: ', err);
              }
            );
          }
        } else {
          console.log('trade app address', getApplicationAddress(environment.TRADE_APP_ID));
          if (await isOptinAsset(this.selectedAssetID, getApplicationAddress(environment.TRADE_APP_ID))) {
            console.log('direct create trade', res);
            this.sendCreateTradeRequest(indexAddress);
          } else {
            this._userService.setupTrade(indexAddress, this.selectedAssetID).subscribe(
              (res) => {
                console.log('setup trade response: ', res);
                if (res) {
                  this.sendCreateTradeRequest(indexAddress);
                } else {
                  console.log('setup trade failed');
                }
              },
              (err) => {
                console.log('setup trade error: ', err);
              }
            );
          }
        }
      },
      (error) => console.log('error', error)
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
      const asset = this.getAsset('' + this.selectedAssetID);
      if (!asset) {
        console.log('exception occurred');
        return;
      }

      const collectionId = this.metadata.collectionId? this.metadata.collectionId: getUUID();

      let assetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.metadataProperties)) {
        assetProperties.push({
          name: key,
          value: value
        })
      }

      const params2 = {
        tradeId: txID,
        assetId: this.selectedAssetID,
        asset: {
          assetId: this.selectedAssetID,
          name: asset.params.name,
          unitName: asset.params['unit-name'],
          supply: asset.params.total,
          assetURL: asset.params.url ? asset.params.url : '',
          creatorWallet: asset.params.creator,
          freezeAddress: asset.params.freeze ? asset.params.freeze : '',
          managerAddress: asset.params.manager ? asset.params.manager : '',
          clawbackAddress: asset.params.clawback ? asset.params.clawback : '',
          reserveAddress: asset.params.reserve ? asset.params.reserve : '',
          metadata: asset.params['metadata-hash'] ? asset.params['metadata-hash'] : '',

          externalLink: this.metadata.external_link ? this.metadata.external_link : '',
          description: this.metadata.description ? this.metadata.description : '',

          assetCollectionID: collectionId,
          assetCollection: {
            assetCollectionID: collectionId,
            name: this.metadata.collection ? (this.metadata.collection.name ? this.metadata.collection.name: '') : '',
            icon: this.metadata.collection ? (this.metadata.collection.icon ? this.metadata.collection.icon: '') : '',
            banner: this.metadata.collection ? (this.metadata.collection.banner ? this.metadata.collection.banner: '') : '',
            featuredImage: this.metadata.collection ? (this.metadata.collection.featuredImage ? this.metadata.collection.featuredImage: '') : '',
            description: this.metadata.collection ? (this.metadata.collection.description ? this.metadata.collection.description: '') : '',
            royalties: this.metadata.collection ? (this.metadata.collection.royalties ? this.metadata.collection.royalties: 0) : 0,
            customURL: this.metadata.collection ? (this.metadata.collection.customURL ? this.metadata.collection.customURL: '') : '',
            category: this.metadata.collection ? (this.metadata.collection.category ? this.metadata.collection.category: '') : '',
            website: this.metadata.collection ? (this.metadata.collection.web ? this.metadata.collection.web: '') : '',
            creatorWallet: this.metadata.collection ? (this.metadata.collection.creatorWallet ? this.metadata.collection.creatorWallet: asset.params.creator) : asset.params.creator
          },

          properties: assetProperties,
          file: this.metadata.file? this.metadata.file : '',
          cover: this.metadata.cover? this.metadata.cover : '',
          royalties: this.metadata.royalty ? this.metadata.royalty : 0
        },
        indexAddress,
        price: this.price,
        creatorWallet: this._walletsConnectService.myAlgoAddress[0],
        amount: this.amount
      }
      console.log('params2', params2);
      this._userService.createTrade(params2).subscribe(
        res => {
          console.log("Created trade successfully");
          console.log(res)
        },
        error => console.log(error)
      );
    }
  }

  async cancelTrade(tradeIndex: string) {
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelTrade(tradeIndex);
    if (result) {
      const result1 = this._userService.cancelTrade(tradeIndex);
      if (result1) {
        console.log('Successfully cancelled')
      }
    }
  }

  public actionBack() {
    this.router.navigateByUrl('/create-offer')
  }

}
