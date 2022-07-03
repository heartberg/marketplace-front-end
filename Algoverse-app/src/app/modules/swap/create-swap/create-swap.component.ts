import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getBalance, getUUID, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-swap',
  templateUrl: './create-swap.component.html',
  styleUrls: ['./create-swap.component.scss']
})
export class CreateSwapComponent implements OnInit {

  private selectedAssetID = 0;
  private offeringAsset: any = null;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public acceptingAssetDescription = "";

  public offerringMetadata: any = {};
  public offerringMetadataProperties: any = {};
  public acceptingMetadata: any = {};
  public acceptingMetadataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public acceptAssetId = 0;
  private accetingAsset: any = null;
  public acceptAmount: string = "0";
  public collectionName: string = "";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private httpClient: HttpClient
  ) {
  }

  async ngOnInit(): Promise<void> {
    console.log('nginit')
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
      this.offeringAsset = firstAsset;

      this.onSelectedAsset(firstAsset.index);
    }
  }

  async onSelectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;
    this.setMaxSupply(this.selectedAssetID);

    const asset = this.getAsset(assetID);
    this.offeringAsset = asset;
    console.log(asset);

    this.maxSupply = await getBalance(this._walletsConnectService.sessionWallet!.getDefaultAccount(), +assetID);

    if (asset.params.url) {
      if (asset.params.url.includes('https://') || asset.params.url.includes('http://')) {
        this.offerringMetadata = await this.httpClient.get(asset.params.url).toPromise();
      } else {
        this.offerringMetadata = await this.httpClient.get('https://' + asset.params.url).toPromise();
      }
    }
    console.log('offerringMetadata', this.offerringMetadata);

    this.selectedAssetDescription = this.offerringMetadata.description ? this.offerringMetadata.description : `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;

    let properties: any = {};
    if (this.offerringMetadata.properties) {
      for (const [key, value] of Object.entries(this.offerringMetadata.properties)) {
        if (typeof value === 'string' || value instanceof String)
          properties[key] = value;
      }
    }
    this.offerringMetadataProperties = properties;
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

  async blurAcceptAssetIndexEvent(event: any) {
    this.acceptAssetId = event.target.value;
    const asset = await this._walletsConnectService.getAsset(this.acceptAssetId);
    if (!asset) {
      alert('Invalid Asset to accept');
      this.acceptAssetId = 0;
      return;
    }
    this.accetingAsset = asset;

    if (asset.params.url) {
      if (asset.params.url.includes('https://') || asset.params.url.includes('http://')) {
        this.acceptingMetadata = await this.httpClient.get(asset.params.url).toPromise();
      } else {
        this.acceptingMetadata = await this.httpClient.get('https://' + asset.params.url).toPromise();
      }
    }
    console.log('acceptingMetadata', this.acceptingMetadata);

    this.acceptingAssetDescription = this.acceptingMetadata.description ? this.acceptingMetadata.description : `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;

    let properties: any = {};
    if (this.acceptingMetadata.properties) {
      for (const [key, value] of Object.entries(this.acceptingMetadata.properties)) {
        if (typeof value === 'string' || value instanceof String)
          properties[key] = value;
      }
    }
    this.acceptingMetadataProperties = properties;
  }

  blurAcceptAmountEvent(event: any) {
    this.acceptAmount = event.target.value;
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
    if (!this.accetingAsset) {
      alert('Select valid acceting asset');
      return;
    }

    console.log('start create swap')
    const getIndexParams = {
      senderAddress: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
      offerAssetId: this.selectedAssetID,
      acceptAssetId: this.acceptAssetId
    }
    this._userService.getSwapIndex(getIndexParams).subscribe(
      async (res) => {
        console.log('swapIndex', res);
        const indexAddress = res.indexAddress;
        const setupParams = {
          indexAddress,
          offerAssetId: this.selectedAssetID,
          acceptAssetId: this.acceptAssetId
        }
        console.log('setupParams', setupParams);

        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          if (result) {
            this._userService.setupSwap(setupParams).subscribe(
              (res) => {
                console.log('setup swap response: ', res);
                if (res) {
                  this.sendCreateSwapRequest(indexAddress);
                } else {
                  console.log('setup swap failed');
                }
              },
              (err) => {
                console.log('setup swap error: ', err);
              }
            )
          }
        } else {
          if (await isOptinAsset(this.selectedAssetID, getApplicationAddress(environment.BID_APP_ID)) && await isOptinAsset(this.acceptAssetId, getApplicationAddress(environment.BID_APP_ID))) {
            console.log('direct create swap', res);
            this.sendCreateSwapRequest(indexAddress);

          } else {
            this._userService.setupSwap(setupParams).subscribe(
              (res) => {
                console.log('setup swap response: ', res);
                if (res) {
                  this.sendCreateSwapRequest(indexAddress);
                } else {
                  console.log('setup swap failed');
                }
              },
              (err) => {
                console.log('setup swap error: ', err);
              }
            );
          }
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

    const asset = this.offeringAsset;
    if (txID) {

      const offerringCollectionId = this.offerringMetadata.collectionId? this.offerringMetadata.collectionId: getUUID();
      let offerringAssetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.offerringMetadataProperties)) {
        offerringAssetProperties.push({
          name: key,
          value: value
        })
      }

      const acceptingCollectionId = this.acceptingMetadata.collectionId? this.acceptingMetadata.collectionId: getUUID();
      let acceptingAssetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.offerringMetadataProperties)) {
        acceptingAssetProperties.push({
          name: key,
          value: value
        })
      }

      const params2 = {
        swapId: txID,
        indexAddress,
        offerAddress: this._walletsConnectService.myAlgoAddress[0],
        offeringAssetId: this.selectedAssetID,
        offeringAmount: this.amount,
        offeringAsset: {
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
          externalLink: this.offerringMetadata.external_link ? this.offerringMetadata.external_link : '',
          description: this.offerringMetadata.description ? this.offerringMetadata.description : '',

          assetCollectionID: offerringCollectionId,
          assetCollection: {
            assetCollectionID: offerringCollectionId,
            name: this.offerringMetadata.collection ? (this.offerringMetadata.collection.name ? this.offerringMetadata.collection.name: '') : '',
            icon: this.offerringMetadata.collection ? (this.offerringMetadata.collection.icon ? this.offerringMetadata.collection.icon: '') : '',
            banner: this.offerringMetadata.collection ? (this.offerringMetadata.collection.banner ? this.offerringMetadata.collection.banner: '') : '',
            featuredImage: this.offerringMetadata.collection ? (this.offerringMetadata.collection.featuredImage ? this.offerringMetadata.collection.featuredImage: '') : '',
            description: this.offerringMetadata.collection ? (this.offerringMetadata.collection.description ? this.offerringMetadata.collection.description: '') : '',
            royalties: this.offerringMetadata.collection ? (this.offerringMetadata.collection.royalties ? this.offerringMetadata.collection.royalties: '') : '',
            customURL: this.offerringMetadata.collection ? (this.offerringMetadata.collection.customURL ? this.offerringMetadata.collection.customURL: '') : '',
            category: this.offerringMetadata.collection ? (this.offerringMetadata.collection.category ? this.offerringMetadata.collection.category: '') : '',
            website: this.offerringMetadata.collection ? (this.offerringMetadata.collection.web ? this.offerringMetadata.collection.web: '') : '',
            creatorWallet: this.offerringMetadata.collection ? (this.offerringMetadata.collection.creatorWallet ? this.offerringMetadata.collection.creatorWallet: asset.params.creator) : asset.params.creator
          },

          properties: offerringAssetProperties,
          file: this.offerringMetadata.file? this.offerringMetadata.file : '',
          cover: this.offerringMetadata.cover? this.offerringMetadata.cover : '',
          royalties: this.offerringMetadata.royalty ? this.offerringMetadata.royalty : 0
        },

        acceptingAssetId: this.acceptAssetId,
        acceptingAsset: {
          assetId: this.acceptAssetId,
          name: this.accetingAsset.params.name,
          unitName: this.accetingAsset.params['unit-name'],
          supply: this.accetingAsset.params.total,
          assetURL: this.accetingAsset.params.url ? this.accetingAsset.params.url : '',
          creatorWallet: this.accetingAsset.params.creator,
          freezeAddress: this.accetingAsset.params.freeze ? this.accetingAsset.params.freeze : '',
          managerAddress: this.accetingAsset.params.manager ? this.accetingAsset.params.manager : '',
          clawbackAddress: this.accetingAsset.params.clawback ? this.accetingAsset.params.clawback : '',
          reserveAddress: this.accetingAsset.params.reserve ? this.accetingAsset.params.reserve : '',
          metadata: this.accetingAsset.params['metadata-hash'] ? this.accetingAsset.params['metadata-hash'] : '',
          externalLink: this.acceptingMetadata.external_link ? this.acceptingMetadata.external_link : '',
          description: this.acceptingMetadata.description ? this.acceptingMetadata.description : '',

          assetCollectionID: acceptingCollectionId,
          assetCollection: {
            assetCollectionID: acceptingCollectionId,
            name: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.name ? this.acceptingMetadata.collection.name: '') : '',
            icon: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.icon ? this.acceptingMetadata.collection.icon: '') : '',
            banner: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.banner ? this.acceptingMetadata.collection.banner: '') : '',
            featuredImage: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.featuredImage ? this.acceptingMetadata.collection.featuredImage: '') : '',
            description: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.description ? this.acceptingMetadata.collection.description: '') : '',
            royalties: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.royalties ? this.acceptingMetadata.collection.royalties: '') : '',
            customURL: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.customURL ? this.acceptingMetadata.collection.customURL: '') : '',
            category: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.category ? this.acceptingMetadata.collection.category: '') : '',
            website: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.web ? this.acceptingMetadata.collection.web: '') : '',
            creatorWallet: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.creatorWallet ? this.acceptingMetadata.collection.creatorWallet: asset.params.creator) : asset.params.creator
          },

          properties: acceptingAssetProperties,
          file: this.acceptingMetadata.file? this.acceptingMetadata.file : '',
          cover: this.acceptingMetadata.cover? this.acceptingMetadata.cover : '',
          royalties: this.acceptingMetadata.royalty ? this.acceptingMetadata.royalty : 0
        },
        acceptingAmount: this.acceptAmount,
        collectionInterestedIn: this.collectionName
      }

      console.log('param', params2);
      this._userService.createSwap(params2).subscribe(
        res => {
          console.log('Successfully created')
          console.log(res)
        },
        error => console.log(error)
      );
    }
  }

  async cancelSwap(swapIndex: string) {
    const result = await this._walletsConnectService.cancelSwap(swapIndex);
    if (result) {
      const result = this._userService.cancelSwap(swapIndex);
      if (result) {
        console.log('Successfully cancelled')
      }
    }
  }

  public actionBack() {
    this.router.navigateByUrl('/create-offer')
  }


}
