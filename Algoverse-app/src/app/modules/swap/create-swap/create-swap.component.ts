import { Component, OnInit } from '@angular/core';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { isOptinAsset } from 'src/app/services/utils.algod';
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';

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
  public metaDataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public acceptAssetId = 0;
  private accetingAsset: any = null;
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
      this.offeringAsset = firstAsset;
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

  onSelectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    const asset = this.getAsset(assetID);
    this.offeringAsset = asset;
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

  async blurAcceptAssetIndexEvent(event: any) {
    this.acceptAssetId = event.target.value;
    const asset = await this._walletsConnectService.getAsset(this.acceptAssetId);
    if (!asset) {
      alert('Invalid Asset to accept');
      this.acceptAssetId = 0;
      return;
    }
    this.accetingAsset = asset;
  }

  blurAcceptAmountEvent(event: any){
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

        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          if (result) {
            this._userService.setupSwap(setupParams).subscribe(
              (res) => {
                console.log('setup swap response: ', res);
                this.sendCreateSwapRequest(indexAddress);
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
                this.sendCreateSwapRequest(indexAddress);
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
      const params2 = {
        swapId: txID,
        indexAddress,
        offerAddress: this._walletsConnectService.myAlgoAddress[0],
        offerringAssetId: this.selectedAssetID,
        offeringAsset: {
          assetId: this.selectedAssetID,
          name: asset.params.name,
          unitName: asset.params['unit-name'],
          supply: asset.params.total,
          assetURL: asset.params.url?asset.params.url:'',
          creatorWallet: asset.params.creator,
          freezeAddress: asset.params.freeze?asset.params.freeze:'',
          managerAddress: asset.params.manager?asset.params.manager:'',
          clawbackAddress: asset.params.clawback?asset.params.clawback:'',
          reserveAddress: asset.params.reserve?asset.params.reserve:'',
          metadata: asset.params['metadata-hash']?asset.params['metadata-hash']:'',
          externalLink: asset.params.url?asset.params.url:'',
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
        offerringAmount: this.amount,
        acceptingAssetId: this.acceptAssetId,
        acceptingAsset: {
          assetId: this.acceptAssetId,
          name: this.accetingAsset.params.name,
          unitName: this.accetingAsset.params['unit-name'],
          supply: this.accetingAsset.params.total,
          assetURL: this.accetingAsset.params.url?this.accetingAsset.params.url:'',
          creatorWallet: this.accetingAsset.params.creator,
          freezeAddress: this.accetingAsset.params.freeze?this.accetingAsset.params.freeze:'',
          managerAddress: this.accetingAsset.params.manager?this.accetingAsset.params.manager:'',
          clawbackAddress: this.accetingAsset.params.clawback?this.accetingAsset.params.clawback:'',
          reserveAddress: this.accetingAsset.params.reserve?this.accetingAsset.params.reserve:'',
          metadata: this.accetingAsset.params['metadata-hash']?this.accetingAsset.params['metadata-hash']:'',
          externalLink: this.accetingAsset.params.url?this.accetingAsset.params.url:'',
          description: this.accetingAsset.description?this.accetingAsset.description:'',
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
        acceptingAmount: this.acceptAmount,
        collectionInterestedIn: this.collectionName
      }
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


}
