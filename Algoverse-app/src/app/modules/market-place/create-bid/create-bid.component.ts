import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { getAlgodClient, getUUID, isOptinAsset } from 'src/app/services/utils.algod';
import { debounceTime } from "rxjs/operators";
import { getApplicationAddress } from 'algosdk';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

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

  public metadata: any = {};
  public metadataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public price: string = "0";

  searchAssetControl: FormControl;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
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

    this.spinner.show();
    const asset = await this._walletsConnectService.getAsset(+assetID);
    if (!asset) {
      this.spinner.hide();
      alert('Invalid asset id');
      return;
    }
    console.log(asset);
    this.mSelectedAsset = asset;

    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
    this.mSelectedAsset = asset;

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

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurAmountEvent(event: any){
    this.amount = (parseFloat(event.target.value) * Math.pow(10, this.mSelectedAsset.params.decimals)).toFixed(0);
    console.log(this.amount);
  }

  blurAlgoEvent(event: any) {
    this.price = (parseFloat(event.target.value) * Math.pow(10, 6)).toFixed(0);
    console.log(this.price);
  }

  async createBid() {
    if (!this.mSelectedAsset) {
      alert('Please select valid asset');
      return;
    }
    if (!this.amount) {
      alert('Please input amount');
      return;
    }
    if (!this.royalty) {
      alert('Please input royalty');
      return;
    }
    if (+this.price < 1000) {
      alert('Please input price at least 1000');
      return;
    }
    if (!this.mSelectedAsset) {
      alert('Please select asset to buy');
      return;
    }

    console.log('bid start');
    this.spinner.show();
    this._userService.getBidIndex(this._walletsConnectService.myAlgoAddress[0]).subscribe(
      async (res) => {
        console.log('bidIndex', res);
        const indexAddress = res.indexAddress;
        let result = await this._walletsConnectService.setupBid(indexAddress, Number(this.selectedAssetID), res.optinPrice);
        if (result) {
          console.log(this.selectedAssetID)
          this._userService.optinAndRekeyToBid(indexAddress).subscribe(
            (res) => {
              console.log('setup bid response: ', res);
              if (res) {
                this.sendCreateBidRequest(indexAddress);

              } else {
                this.spinner.hide();
                alert('optin and rekey failed');
              }
            },
            (err) => {
              this.spinner.hide();
              alert('setup bid error: ' + err);
            }
          )
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
        console.log('algo net create bid error', error)
        alert('Network error, please try again later')
      }
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

    if (txID) {
      const asset = this.mSelectedAsset;
      const collectionId = this.metadata.collectionId? this.metadata.collectionId: getUUID();

      let assetProperties: { name: any; value: any; }[] = [];
      for (const [key, value] of Object.entries(this.metadataProperties)) {
        assetProperties.push({
          name: key,
          value: value
        })
      }

      if (txID && asset) {
        const params2 = {
          bidId: txID,
          bidderAddress: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
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
          amount: this.amount
        }
        console.log('create bid param', params2)
        this._userService.createBid(params2).subscribe(
          res => {
            this.spinner.hide();
            alert('Successfully created');
            console.log(res);
          },
          error => {
            this.spinner.hide();
            alert(error);
            console.log('Network error, please try again later');
          }
        );
      }
    } else {
      this.spinner.hide();
      alert("Failed creating bid on algorand network");
    }
  }

  async cancelBid(bidIndex: string) {
    console.log('start cancel trade');
    const result = await this._walletsConnectService.cancelBid(bidIndex);
    if (result) {
      this._userService.cancelBid(bidIndex).subscribe(
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
