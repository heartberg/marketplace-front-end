import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpfsDaemonService } from 'src/app/services/ipfs-daemon.service';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {

  public categoryList = ['Collectible items', 'Artwork', 'Event tickets', 'Music and media', 'Gaming', 'Big Sports Moments', 'Virtual Fashion', 'Real-world assets', 'Memes', 'Domain names'];
  public name: string = "";
  public description: string = "";
  public royalty: string = "0";
  public externalLink: string = "";
  public website: string = "0";
  public category: string = "Collectible items";
  public iconUrl: string = "";
  public bannerUrl: string = "";
  public imageUrl: string = "";

  constructor(
    private ipfsDaemonService: IpfsDaemonService,
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private _location: Location,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }


  }

  blurNameEvent(event: any) {
    this.name = event.target.value;
    console.log(this.royalty);
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

  blurWebEvent(event: any) {
    this.website = event.target.value;
    console.log(this.website);
  }

  selectedCategory(category: string) {
    this.category = category;
    console.log(this.category);
  }

  async onIconInput(e: any) {
    console.log('e', e.target.files[0]);
    this.iconUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('iconUrl', this.iconUrl);
  }

  async onBannerInput(e: any) {
    console.log('e', e.target.files[0]);
    this.bannerUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('bannerUrl', this.bannerUrl);
  }

  async onFileInput(e: any) {
    console.log('e', e.target.files[0]);
    this.imageUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('imageUrl', this.imageUrl);
  }

  onSubmit() {
    if (!this.name) {
      alert('Please input name');
      return;
    }
    if (!this.description) {
      alert('Please input description');
      return;
    }
    if (!this.iconUrl) {
      alert('Please add icon');
      return;
    }
    if (!this.bannerUrl) {
      alert('Please add banner image');
      return;
    }
    if (!this.imageUrl) {
      alert('Please add featured image');
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
    if (!this.category) {
      alert('Please select category');
      return;
    }
    if (!this.website) {
      alert('Please input website url');
      return;
    }

    const param = {
      name: this.name,
      icon: this.iconUrl,
      banner: this.bannerUrl,
      featuredImage: this.imageUrl,
      description: this.description,
      royalty: this.royalty,
      customURL: this.externalLink,
      category: this.category,
      website: this.website,
      creatorWallet: this._walletsConnectService.sessionWallet!.getDefaultAccount()
    }

    this.spinner.show();
    console.log('param', param);
    this._userService.createCollection(param).subscribe(
      res => {
        this.spinner.hide();
        alert('Successfully added');
      },
      error => {
        this.spinner.hide();
        console.log('error', error);
        alert('Failed, please retry later');
      }
    )
  }

  onBack() {
    this._location.back();
  }

}
