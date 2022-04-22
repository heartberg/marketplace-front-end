import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, isOptinAsset } from 'src/app/services/utils.algod';
import { debounceTime } from "rxjs/operators";
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-bid',
  templateUrl: './create-bid.component.html',
  styleUrls: ['./create-bid.component.scss'],
  providers: []
})
export class CreateBidComponent implements OnInit {

  private selectedAssetID = 0;
  private mSelectedAsset: any = null;
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public price: string = "0";

  searchAssetControl: FormControl;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private _fb: FormBuilder
  ) {
    this.searchAssetControl = new FormControl();
    this.searchAssetControl.valueChanges.pipe(debounceTime(1000)).subscribe(async res => {
      await this.selectedAsset(res);
    });
  }

  async ngOnInit(): Promise<void> {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }
  }

  async selectedAsset(assetID: string) {
    this.selectedAssetID = +assetID;

    const asset = await this._walletsConnectService.getAsset(+assetID);
    if (!asset) {
      alert('Invalid asset id');
      return;
    }

    console.log(asset);
    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
    this.mSelectedAsset = asset;

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

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurAmountEvent(event: any){
    this.amount = event.target.value;
    console.log(this.amount);
  }

  blurAlgoEvent(event: any) {
    this.price = event.target.value;
    console.log(this.price);
  }

  async createBid() {
    if (!this.mSelectedAsset) {
      alert('Please select valid asset id');
      return;
    }
    console.log('bid start');
    this._userService.getBidIndex(this._walletsConnectService.myAlgoAddress[0], this.selectedAssetID).subscribe(
      async (res) => {
        console.log('bidIndex', res);
        const indexAddress = res.indexAddress;
        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          if (result) {
            console.log(this.selectedAssetID)
            this._userService.setupBid(indexAddress, this.selectedAssetID).subscribe(
              (res) => {
                console.log('setup bid response: ', res);
                if (res) {
                  this.sendCreateBidRequest(indexAddress);
                } else {
                  console.log('failed setup bid', res);
                }
              },
              (err) => {
                console.log('setup bid error: ', err);
              }
            )
          }
        } else {
          console.log('bid app address', getApplicationAddress(environment.BID_APP_ID));
          if (await isOptinAsset(this.selectedAssetID, getApplicationAddress(environment.BID_APP_ID))) {
            console.log('direct create trade');
            this.sendCreateBidRequest(indexAddress);

          } else {
            this._userService.setupBid(indexAddress, this.selectedAssetID).subscribe(
              (res) => {
                if (res) {
                  console.log('setup bid response: ', res);
                  this.sendCreateBidRequest(indexAddress);
                } else {
                  console.log('failed setup bid', res);
                }
              },
              (err) => {
                console.log('setup bid error: ', err);
              }
            );
          }
        }
      },
      (error) => console.log('algo net create bid error', error)
    );
  }

  async sendCreateBidRequest(indexAddress: string) {
    const params1 = {
      assetID: this.selectedAssetID,
      amount: this.amount,
      price: this.price,
      bidIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createBid(params1);
    console.log('txID', txID);

    const asset = this.mSelectedAsset;
    if (txID && asset) {
      const params2 = {
        bidId: txID,
        assetId: this.selectedAssetID,
        asset: {
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
        indexAddress: indexAddress,
        price: this.price,
        bidderAddress: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
        amount: this.amount
      }
      this._userService.createBid(params2).subscribe(
        res => {
          console.log('successfully created bid on backend')
        },
        error => console.log('created bid on backend error', error)
      );
    }
  }

  async cancelBid(bidIndex: string) {
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelTrade(bidIndex);
    if (result) {
      const result1 = this._userService.cancelTrade(bidIndex);
      if (result1) {
        console.log('Successfully cancelled')
      }
    }
  }

}
