import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getHashes } from 'crypto';
import { IpfsDaemonService } from 'src/app/services/ipfs-daemon.service';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';
import { metadataHash } from 'src/app/services/utils.algod';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import * as sha256 from 'js-sha256';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent implements OnInit {

  public collections: Array<any> = []
  public passedCollection: any = {}
  public passedCollectionName: any = {}
  public pushedItems: any[] = [1];
  public toggleCounter: number = 1;
  public name: string = "";
  public unitName: string = "";
  public description: string = "";
  public royalty: string = "0";
  public externalLink: string = "";
  public supply: string = "0";
  public fileUrl: string = "";
  public coverUrl: string = "";
  public decimals: string = "0";

  public isMusicUpload: boolean = false;
  public isVideoUpload: boolean = false;
  animation_url_mimetype: any;
  image_mimetype: any;

  constructor(
    private ipfsDaemonService: IpfsDaemonService,
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private _stateService: StateService,
    private router: Router,
    private _location: Location,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    this.passedCollection = this._stateService.passingData;
    this.passedCollectionName = this.passedCollection?this.passedCollection.name:'';

    console.log(this.passedCollection)

    this._userService.loadCollections(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
      (collections: any) => {
        this._stateService.collections = collections
        collections.forEach((col: any) => {
          this.collections.push(col.name)
        })
        console.log(collections)
        if (this.collections.length > 0) {
          console.log("hit1")
          if (!this.passedCollection) {
            console.log("hit2")
            this.passedCollectionName = this.collections[0];
            this.selectedCollection(this.passedCollectionName)
            console.log(this.passedCollection)
          }
        }
      }
    )
    
      // for (let item of this._stateService.collections) {
      //   this.collections.push(item.name);
      // }

    const asd = new Uint8Array([77, 174, 24, 184, 124, 209, 85, 243, 77, 235, 109, 183, 108, 40, 0, 128, 37, 182, 20, 242, 65, 232, 91, 122, 47, 178, 56, 179,96,255,95,206])
    const hex = Buffer.from(asd).toString('hex');
    console.log('hex', hex);
  }

  addSection() {
    this.pushedItems.push(1);
  }

  minus() {
    this.pushedItems.pop();
  }

  toggleEvent() {
    this.toggleCounter ++;
    if (this.toggleCounter % 2 === 0) {

    }
  }

  selectedCollection(collectionName: string) {
    this.passedCollection = this._stateService.getCollectionByName(collectionName);
    delete this.passedCollection.stars
    delete this.passedCollection.volume
  }

  blurNameEvent(event: any) {
    this.name = event.target.value;
    console.log(this.name);
  }

  blurUnitNameEvent(event: any) {
    this.unitName = event.target.value;
    console.log(this.unitName);
  }

  blurDescriptionEvent(event: any) {
    this.description = event.target.value;
    console.log(this.description);
  }

  blurRoyaltyEvent(event: any) {
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurExternalLinkEvent(event: any) {
    this.externalLink = event.target.value;
    console.log(this.externalLink);
  }

  blurSupplyEvent(event: any) {
    this.supply = event.target.value;
    console.log(this.supply);
  }

  blurDecimalsEvent(event: any) {
    this.decimals = event.target.value;
    console.log(this.decimals)
  }

  async onFileInput(e: any) {
    console.log("fileupload")
    console.log('e', e.target.files[0]);
    console.log('e type: ', e.target.files[0].type)
    this.fileUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('fileUrl', this.fileUrl);
    if(e.target.files[0].type.toString() == "audio/mpeg" || e.target.files[0].type.toString() == "audio/mp3") {
      this.isMusicUpload = true;
      this.isVideoUpload = false;
      this.animation_url_mimetype = e.target.files[0].type.toString();
    } else if(e.target.files[0].type.toString() == "video/mp4" || e.target.files[0].type.toString() == "video/mpeg") { 
      this.isMusicUpload = false;
      this.isVideoUpload = true;
      this.animation_url_mimetype = e.target.files[0].type.toString();
    } else {
      this.isMusicUpload = false;
      this.isVideoUpload = false;
      this.image_mimetype = e.target.files[0].type.toString();
    }
  }

  async onCoverInput(e: any) {
    console.log('e', e.target.files[0]);
    this.coverUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    this.image_mimetype = e.target.files[0].type.toString()
    console.log('coverUrl', this.coverUrl);
  }

  async submitAsset() {
    if (!this.passedCollection) {
      alert('Please select a collection');
      return;
    }
    if (!this.name) {
      alert('Please input name');
      return;
    }
    if (!this.unitName) {
      alert('Please input unit name');
      return;
    }
    if (!this.description) {
      alert('Please input description');
      return;
    }
    if (!this.royalty) {
      alert('Please input royalty');
      return;
    }
    if (!this.externalLink) {
      alert('Please input url');
      return;
    }
    if (!this.supply) {
      alert('Please input supply');
      return;
    }
    if (!this.fileUrl) {
      alert('Please add file');
      return;
    }
    if (!this.coverUrl && (this.isMusicUpload || this.isVideoUpload)) {
      alert('Please add cover image');
      return;
    }

    this.spinner.show();
    delete this.passedCollection.creator;
    let metadata;
    if(this.isMusicUpload || this.isVideoUpload) {
      metadata = {
        name: this.name,
        description: this.description,
        image: this.coverUrl,
        image_mimetype: this.image_mimetype,
        external_url: this.externalLink,
        animation_url: this.fileUrl,
        animation_url_mimetype: this.animation_url_mimetype,
        properties: {
          collection: this.passedCollection,
          royalty: this.royalty,
          attributes: {
            height: 3,
            length: 2
          }
        }
      }
    } else {
      metadata = {
        name: this.name,
        description: this.description,
        image: this.fileUrl,
        image_mimetype: this.image_mimetype,
        external_url: this.externalLink,
        properties: {
          collection: this.passedCollection,
          royalty: this.royalty,
          attributes: {
            height: 3,
            length: 2
          }
        }
      }
    }
    
    const ipfsUrl = await this.ipfsDaemonService.addMetaData(metadata);
    let assetUrl = "ipfs://" + ipfsUrl.split("/")[ipfsUrl.split("/").length -1] + "#arc3"
    console.log('ipfsUrl', ipfsUrl);
    console.log(assetUrl)

    const hash2 = sha256.sha256.hmac.update('arc0003/amj', JSON.stringify(metadata));
    const hash = new Uint8Array(hash2.digest());
    console.log('hash', hash)

    const params = {
      name: this.name,
      unitName: this.unitName,
      supply: this.supply,
      assetURL: assetUrl,
      hash,
      image: this.coverUrl,
      decimals: this.decimals
    }
    console.log('params', params);
    const assetId = await this._walletsConnectService.createAsset(params);
    console.log('assetId', assetId);

    if (assetId) {
      const params = {
        assetId: assetId,
        name: this.name,
        unitName: this.unitName,
        creatorWallet: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
        assetURL: ipfsUrl,
        description: this.description,
        supply: this.supply,
        clawbackAddress: "",
        managerAddress: "",
        freezeAddress: "",
        reserveAddress: "",
        metadata: Buffer.from(hash).toString('hex'),
        file: this.fileUrl,
        cover: this.coverUrl,
        royalties: this.royalty,
        externalLink: this.externalLink,
        collectionId: this.passedCollection.collectionId,
        properties: {},
        createOffer: true
      }

      console.log('params', params);
      this._userService.createAsset(params).subscribe(
        res => {
          this.spinner.hide();
          alert('Successfully minted')
        },
        err => {
          this.spinner.hide();
          console.log(err);
          alert('Failed, please retry later');
        }
      )
    } else {
      this.spinner.hide();
      alert('Failed to mint asset on network');
    }
  }

  onBack() {
    this._location.back();
  }

}
