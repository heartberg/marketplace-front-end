import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getBalance, getUUID } from 'src/app/services/utils.algod';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

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

  public metadata: any = {};
  public metadataProperties: any = {};
  public price = 0;
  public assetAmount = 0;
  public minimumIncrement = 0;
  public startTime = "";
  public endTime = "";

  public royalty: string = "0";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
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

    const firstAsset = this.assets[0];
    this.setMaxSupply(firstAsset.index);
    this.onSelectedAsset(firstAsset.index);
  }

  async onSelectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    this.spinner.show();
    this.setMaxSupply(+assetID);

    const asset = this.getAsset(assetID);
    this.selectedAsset = asset;
    console.log(asset);

    if (asset.params.url) {
      if (asset.params.url.includes('https://') || asset.params.url.includes('http://')) {
        this.metadata = await this.httpClient.get(asset.params.url).toPromise();
      } else {
        this.metadata = await this.httpClient.get('https://' + asset.params.url).toPromise();
      }
    }
    console.log('metadata', this.metadata);
    this.spinner.hide();

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

  blurPriceEvent(event: any) {
    this.price = event.target.value;
    console.log(this.price);
  }

  blurAssetAmountEvent(event: any) {
    this.assetAmount = event.target.value;
    console.log(this.assetAmount);
  }

  blurMinimumIncrementEvent(event: any) {
    this.minimumIncrement = event.target.value;
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
    if (!this.royalty) {
      alert('Please input royalty');
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
          if (result == 0) {
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
      const asset = this.selectedAsset.params;
      console.log(asset);
      const collectionId = this.metadata.collectionId ? this.metadata.collectionId : getUUID();

      let assetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.metadataProperties)) {
        assetProperties.push({
          name: key,
          value: value
        })
      }

      const params = {
        auctionId: txID,
        indexAddress,
        assetId: this.selectedAsset.index,
        asset: {
          assetId: this.selectedAsset.index,
          name: asset.name,
          unitName: asset['unit-name'],
          supply: asset.total,
          assetURL: "string",
          creatorWallet: asset.creator,
          freezeAddress: asset.freeze ? asset.freeze : '',
          managerAddress: asset.manager ? asset.manager : '',
          clawbackAddress: asset.clawback ? asset.clawback : '',
          reserveAddress: asset.reserve ? asset.reserve : '',
          metadata: asset['metadata-hash'] ? asset['metadata-hash'] : '',
          externalLink: this.metadata.external_link ? this.metadata.external_link : '',
          description: this.metadata.description ? this.metadata.description : '',

          assetCollectionID: collectionId,
          assetCollection: {
            assetCollectionID: collectionId,
            name: this.metadata.collection ? (this.metadata.collection.name ? this.metadata.collection.name : '') : '',
            icon: this.metadata.collection ? (this.metadata.collection.icon ? this.metadata.collection.icon : '') : '',
            banner: this.metadata.collection ? (this.metadata.collection.banner ? this.metadata.collection.banner : '') : '',
            featuredImage: this.metadata.collection ? (this.metadata.collection.featuredImage ? this.metadata.collection.featuredImage : '') : '',
            description: this.metadata.collection ? (this.metadata.collection.description ? this.metadata.collection.description : '') : '',
            royalties: this.metadata.collection ? (this.metadata.collection.royalties ? this.metadata.collection.royalties : 0) : 0,
            customURL: this.metadata.collection ? (this.metadata.collection.customURL ? this.metadata.collection.customURL : '') : '',
            category: this.metadata.collection ? (this.metadata.collection.category ? this.metadata.collection.category : '') : '',
            website: this.metadata.collection ? (this.metadata.collection.web ? this.metadata.collection.web : '') : '',
            creatorWallet: this.metadata.collection ? (this.metadata.collection.creatorWallet ? this.metadata.collection.creatorWallet : asset.creator) : asset.creator
          },

          properties: assetProperties,
          file: this.metadata.file ? this.metadata.file : '',
          cover: this.metadata.cover ? this.metadata.cover : '',
          royalties: this.metadata.royalty ? this.metadata.royalty : 0
        },
        amount: this.assetAmount,
        creatorWallet: this._walletsConnectService.sessionWallet?.getDefaultAccount(),
        startTime: this.startTime,
        closingTime: this.endTime,
        minimumIncrement: this.minimumIncrement
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
    this.router.navigateByUrl('/create-offer')
  }

}
