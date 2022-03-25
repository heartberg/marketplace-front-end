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

    const asset = await this.getAsset(assetID);
    console.log(asset);
    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;

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

  async getAsset(assetID: string): Promise<any> {
    const client = getAlgodClient();
    const asset = await client.getAssetByID(+assetID).do();
    console.log(asset);
    return asset;
  }

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurAssetIDEvent(event: any){
    this.price = event.target.value;
    console.log(this.price);
  }

  blurAmountEvent(event: any){
    this.amount = event.target.value;
    console.log(this.amount);
  }

  blurAlgoEvent(event: any) {
    this.selectedAssetID = event.target.value;
    console.log(this.selectedAssetID);
  }

  async createBid() {
    this._userService.getBidIndex(this._walletsConnectService.myAlgoAddress[0]).subscribe(
      async (res) => {
        console.log('bidIndex', res);
        const indexAddress = res.indexAddress;
        if (res.optinPrice > 0) {
          let result = await this._walletsConnectService.payToSetUpIndex(indexAddress, res.optinPrice);
          if (result) {
            this._userService.setupBid(indexAddress).subscribe(
              (res) => {
                console.log('setup trade response: ', res);
                this.sendCreateBidRequest(indexAddress);
              },
              (err) => {
                console.log('setup trade error: ', err);
              }
            )
          }
        } else {
          console.log('bid app address', getApplicationAddress(environment.BID_APP_ID));
          if (await isOptinAsset(this.selectedAssetID, getApplicationAddress(environment.BID_APP_ID))) {
            console.log('direct create trade', res);
            this.sendCreateBidRequest(indexAddress);

          } else {
            this._userService.setupBid(indexAddress).subscribe(
              (res) => {
                console.log('setup trade response: ', res);
                this.sendCreateBidRequest(indexAddress);
              },
              (err) => {
                console.log('setup trade error: ', err);
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

    if (txID) {
      const params2 = {
        bidId: txID,
        assetId: this.selectedAssetID,
        indexAddress: indexAddress,
        price: this.price,
        bidderAddress: this._walletsConnectService.myAlgoAddress[0],
        amount: this.amount
      }
      this._userService.createBid(params2).subscribe(
        res => {
          console.log('created bid on backend', res)
        },
        error => console.log('created bid on backend error', error)
      );
    }
  }

}
