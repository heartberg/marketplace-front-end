import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss']
})
export class CreateAuctionComponent implements OnInit {


  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetID = 0;
  public selectedAsset: any = {};
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};
  public price = 0;
  public assetAmount = 0;
  public minimumIncrement = 0;
  public startTime = "";
  public endTime = "";

  public royalty: string = "0";

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
      this.selectedAsset = this.assets[0];
      this.selectedAssetID = this.selectedAsset.index;
      this.selectedAssetDescription = `Name: ${this.selectedAsset.params.name} \nUnitName: ${this.selectedAsset.params['unit-name']}`;

      if (this.selectedAsset.params.url) {
        this._userService.loadMetaData(this.selectedAsset.params.url).subscribe(
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

  onSelectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;
    const asset = this.getAsset(assetID);
    this.selectedAsset = asset;
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

  endStartTimeEvent(event: any) {
    this.endTime = event.target.value;
    console.log(this.endTime);
  }

  async createAuction() {
    console.log('auction start');
    this._userService.getAuctionIndex(this._walletsConnectService.sessionWallet!.getDefaultAccount(), this.selectedAssetID).subscribe(
      async (res) => {
        console.log('auctionIndex', res);

        const indexAddress = res.indexAddress;
        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          if (result) {
            this.sendCreateAuctionRequest(indexAddress);
          } else {
            console.log('Failed on setup payment')
          }
        }

        this.sendCreateAuctionRequest(indexAddress);
      },
      (error) => console.log('error', error)
    );
  }

  async sendCreateAuctionRequest(indexAddress: string) {
    console.log('started creating auction');
    console.log(this.royalty);

    const params1 = {
      bidIndex: indexAddress,
      assetID: this.selectedAssetID,
      amount: this.assetAmount,
      price: this.price,
      startTime: this.startTime,
      endTime: this.endTime,
      minimumIncrement: this.minimumIncrement,
    }
    const txID = await this._walletsConnectService.createAuction(params1);
    console.log('txID', txID);

    const asset = this.selectedAsset.params;
    console.log(asset);
    const params = {
      auctionID: txID,
      auctionIndex: indexAddress,
      assetId: this.selectedAsset.index,
      asset: {
        assetId: this.selectedAsset.index,
        name: asset.name,
        unitName: asset['unit-name'],
        supply: asset.total,
        assetURL: "string",
        creatorWallet: asset.creator,
        freezeAddress: asset.freeze?asset.freeze:'',
        managerAddress: asset.manager?asset.manager:'',
        clawbackAddress: asset.clawback?asset.clawback:'',
        reserveAddress: asset.reserve?asset.reserve:'',
        metadata: asset['metadata-hash']?asset['metadata-hash']:'',
        externalLink: asset.url?asset.url:'',
        description: asset.description?asset.description:'',
        assetCollectionID: "1",
        assetCollection: {
          assetCollectionID: "1",
          name: "string1",
          icon: "string",
          banner: "string",
          featuredImage: "string",
          description: "string",
          royalties: 0,
          customURL: "string",
          category: "string",
          website: "string",
          creatorWallet: "string"
        },
        properties: Object.entries(this.metaDataProperties),
        file: "string",
        cover: "string",
        royalties: 0,
        category: "string"
      },
      amount: 2,
      creatorWallet: this._walletsConnectService.sessionWallet?.getDefaultAccount(),
      startTime: this.startTime,
      closingTime: this.endTime,
      minimumIncrement: this.minimumIncrement
    }
    console.log('params', params)

    this._userService.createAuction(params).subscribe(
      res => {
        console.log("Created auction successfully");
        console.log(res)
      },
      error => console.log(error)
    );
  }

  async cancelAuction(bidIndex: string) {
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelAuction(bidIndex);
    if (result) {
      const result1 = this._userService.cancelAuction(bidIndex);
      if (result1) {
        console.log('Successfully cancelled')
      }
    }
  }

}
