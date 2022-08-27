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
import { Location } from '@angular/common';
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-create-bid',
  templateUrl: './create-bid.component.html',
  styleUrls: ['./create-bid.component.scss'],
  providers: []
})
export class CreateBidComponent implements OnInit {

  private selectedAssetID = 0;
  public mSelectedAsset: any = null;
  public selectedAssetDescription = "";
  public selectedAssetDecimals = 0;
  public maxSupply = 0;

  public metadata: any = {};
  public metadataProperties: any = {};

  public amount: string = "0";
  public price: string = "0";

  searchAssetControl: FormControl;
  metadataAttributes: any;
  selectedAssetTotal: number = 0;
  public isDark: boolean = false;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private readonly _themeService: ThemeService
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
    this.subscribeToThemeColor();
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
    this.selectedAssetDecimals = asset['params']['decimals']
    this.maxSupply = asset['params']['total'] / Math.pow(10, this.selectedAssetDecimals)
    this.selectedAssetTotal = asset['params']['total']

    if(this.selectedAssetDecimals == 0 && this.selectedAssetTotal == 1) {
      this.amount = "1"
    } else {
      this.amount = ""
    }

    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
    this.mSelectedAsset = asset;

    if (asset.params.url) {
      await this.getMetadata(asset.params.url)
    }
    console.log('metadata', this.metadata);
    this.spinner.hide();

    this.selectedAssetDescription = this.metadata.description ? this.metadata.description : `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;

  }

  async getMetadata(ipfsUrl: string) {
    this.spinner.show();
    if (ipfsUrl.includes('ipfs://')) {
      let url = environment.ipfs_base + this.mSelectedAsset.params.url.split("/")[this.mSelectedAsset.params.url.split("/").length - 1]
      this.metadata = await this.httpClient.get(url).toPromise();
    } else if(this.mSelectedAsset.params.url.includes('https://')){
      this.metadata = await this.httpClient.get(this.mSelectedAsset.params.url).toPromise();
    } else {
      this.metadata = await this.httpClient.get('https://' + this.mSelectedAsset.params.url).toPromise();
    }

    this.spinner.hide();
    let properties: any = {};
    let attributes: any = {};
    if (this.metadata.properties) {
      for (const [key, value] of Object.entries(this.metadata.properties)) {
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
    this.metadataProperties = properties;
    this.metadataAttributes = attributes;
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
    if (+this.price < 1000) {
      alert('Please input price at least 1000');
      return;
    }
    if (!this.mSelectedAsset) {
      alert('Please select asset to buy');
      return;
    }

    if(+this.amount < 1) {
      alert("Too many decimals on asset amount!");
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
          if (result === 0) {
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
      if (txID && asset) {
        const params2 = {
          bidId: txID,
          bidderAddress: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
          assetId: this.selectedAssetID,
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
    this._location.back();
  }

  private subscribeToThemeColor(): void {
    this._themeService.$colorTheme.subscribe((theme: string) => {
      theme === "dark" ? this.isDark = true : this.isDark = false;
    })
  }

}
