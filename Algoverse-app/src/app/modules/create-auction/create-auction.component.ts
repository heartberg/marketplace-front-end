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
  public selectedAsset: any = {};
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

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

  async createAuction() {
    console.log('started creating auction');
    console.log(this.royalty);

    const result = await this._walletsConnectService.createAuction()
    if (!result.appId) {
      console.log('failed creating auction');
    }

    const asset = this.selectedAsset.params;
    console.log(asset);
    const params = {
      smartContractId: "" + result.appId,
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
      startTime: "2022-04-13T18:58:36.460Z",
      closingTime: "2022-04-13T18:58:36.460Z",
      isPaidMinimumBalance: result.paidMinimumBalance,
      minimumBid: 0
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

  async sendCreateAuctionRequest(indexAddress: string) {
    // const params1 = {
    //   assetID: this.selectedAssetID,
    //   amount: this.amount,
    //   price: this.price,
    //   bidIndex: indexAddress
    // }
    // const txID = await this._walletsConnectService.createBid(params1);
    // console.log('txID', txID);

    // if (txID) {
    //   const params2 = {
    //     bidId: txID,
    //     assetId: this.selectedAssetID,
    //     indexAddress: indexAddress,
    //     price: this.price,
    //     bidderAddress: this._walletsConnectService.myAlgoAddress[0],
    //     amount: this.amount
    //   }
    //   this._userService.createBid(params2).subscribe(
    //     res => {
    //       console.log('created bid on backend', res)
    //     },
    //     error => console.log('created bid on backend error', error)
    //   );
    // }
  }

}
