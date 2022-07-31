import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getBalance, getUUID, isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
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

    const asset_ids = [];
    for (let asset of this.assets) {
      asset_ids.push(asset.index);
    }
    this.assetIDs = asset_ids;

    const firstAsset = this.assets[0];
    this.onSelectedAsset(firstAsset.index);
  }

  async onSelectedAsset(assetID: string) {
    this.offeringAssetId = +assetID;
    this.offeringAssetParams = await this._walletsConnectService.getAsset(+assetID);
    this.offeringAssetDecimals = this.offeringAssetParams['params']['decimals']

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
    let properties: any = {};
    let attributes: any = {};
    if (this.acceptingMetadata.properties) {
      for (const [key, value] of Object.entries(this.acceptingMetadata.properties)) {
        if(key === 'attributes') {
          for (const [a_key, a_value] of Object.entries(value as Object)) {
            attributes[a_key] = a_value
          }
        } else {
          properties[key] = value
        }
      }
    }
    properties['attributes'] = attributes
    this.acceptingMetadataProperties = properties;
    this.acceptingMetadataAttributes = attributes;
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
    let properties: any = {};
    let attributes: any = {};
    if (this.offerringMetadata.properties) {
      for (const [key, value] of Object.entries(this.offerringMetadata.properties)) {
        if(key === 'attributes') {
          for (const [a_key, a_value] of Object.entries(value as Object)) {
            attributes[a_key] = a_value
          }
        } else {
          properties[key] = value
        }
      }
    }
    properties['attributes'] = attributes
    this.offerringMetadataProperties = properties;
    this.offeringMetadataAttributes = attributes;
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

    const asset = this.offeringAsset;
    if (txID) {
      const offerringCollectionId = this.offerringMetadata.collectionId ? this.offerringMetadata.collectionId : getUUID();
      let offerringAssetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.offeringMetadataAttributes)) {
        offerringAssetProperties.push({
          name: key,
          value: value
        })
      }

      const acceptingCollectionId = this.acceptingMetadata.collectionId ? this.acceptingMetadata.collectionId : getUUID();
      let acceptingAssetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.acceptingMetadataAttributes)) {
        acceptingAssetProperties.push({
          name: key,
          value: value + ''
        })
      }

      const params2 = {
        swapId: txID,
        indexAddress,
        offerAddress: this._walletsConnectService.myAlgoAddress[0],
        offeringAssetId: this.offeringAssetId,
        offeringAmount: this.amount,
        offeringAsset: {
          assetId: this.offeringAssetId,
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
            name: this.offerringMetadata.collection ? (this.offerringMetadata.collection.name ? this.offerringMetadata.collection.name : '') : '',
            icon: this.offerringMetadata.collection ? (this.offerringMetadata.collection.icon ? this.offerringMetadata.collection.icon : '') : '',
            banner: this.offerringMetadata.collection ? (this.offerringMetadata.collection.banner ? this.offerringMetadata.collection.banner : '') : '',
            featuredImage: this.offerringMetadata.collection ? (this.offerringMetadata.collection.featuredImage ? this.offerringMetadata.collection.featuredImage : '') : '',
            description: this.offerringMetadata.collection ? (this.offerringMetadata.collection.description ? this.offerringMetadata.collection.description : '') : '',
            customURL: this.offerringMetadata.collection ? (this.offerringMetadata.collection.customURL ? this.offerringMetadata.collection.customURL : '') : '',
            category: this.offerringMetadata.collection ? (this.offerringMetadata.collection.category ? this.offerringMetadata.collection.category : '') : '',
            website: this.offerringMetadata.collection ? (this.offerringMetadata.collection.web ? this.offerringMetadata.collection.web : '') : '',
            creatorWallet: this.offerringMetadata.collection ? (this.offerringMetadata.collection.creatorWallet ? this.offerringMetadata.collection.creatorWallet : asset.params.creator) : asset.params.creator
          },

          properties: offerringAssetProperties,
          file: this.offerringMetadata.file ? this.offerringMetadata.file : '',
          cover: this.offerringMetadata.cover ? this.offerringMetadata.cover : '',
        },

        acceptingAssetId: this.acceptingAssetId,
        acceptingAsset: {
          assetId: this.acceptingAssetId,
          name: this.acceptingAsset.params.name,
          unitName: this.acceptingAsset.params['unit-name'],
          supply: this.acceptingAsset.params.total,
          assetURL: this.acceptingAsset.params.url ? this.acceptingAsset.params.url : '',
          creatorWallet: this.acceptingAsset.params.creator,
          freezeAddress: this.acceptingAsset.params.freeze ? this.acceptingAsset.params.freeze : '',
          managerAddress: this.acceptingAsset.params.manager ? this.acceptingAsset.params.manager : '',
          clawbackAddress: this.acceptingAsset.params.clawback ? this.acceptingAsset.params.clawback : '',
          reserveAddress: this.acceptingAsset.params.reserve ? this.acceptingAsset.params.reserve : '',
          metadata: this.acceptingAsset.params['metadata-hash'] ? this.acceptingAsset.params['metadata-hash'] : '',
          externalLink: this.acceptingMetadata.external_link ? this.acceptingMetadata.external_link : '',
          description: this.acceptingMetadata.description ? this.acceptingMetadata.description : '',

          assetCollectionID: acceptingCollectionId,
          assetCollection: {
            assetCollectionID: acceptingCollectionId,
            name: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.name ? this.acceptingMetadata.collection.name : '') : '',
            icon: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.icon ? this.acceptingMetadata.collection.icon : '') : '',
            banner: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.banner ? this.acceptingMetadata.collection.banner : '') : '',
            featuredImage: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.featuredImage ? this.acceptingMetadata.collection.featuredImage : '') : '',
            description: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.description ? this.acceptingMetadata.collection.description : '') : '',
            customURL: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.customURL ? this.acceptingMetadata.collection.customURL : '') : '',
            category: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.category ? this.acceptingMetadata.collection.category : '') : '',
            website: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.web ? this.acceptingMetadata.collection.web : '') : '',
            creatorWallet: this.acceptingMetadata.collection ? (this.acceptingMetadata.collection.creatorWallet ? this.acceptingMetadata.collection.creatorWallet : asset.params.creator) : asset.params.creator
          },

          properties: acceptingAssetProperties,
          file: this.acceptingMetadata.file ? this.acceptingMetadata.file : '',
          cover: this.acceptingMetadata.cover ? this.acceptingMetadata.cover : '',
        },
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
    this.router.navigateByUrl('/create-offer')
  }


}
