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

  public categoryList = ['Collectibles', 'Artwork', 'Tickets', 'Music', 'Media', 'Gaming', 'Wearable', 'Physical assets', 'Domain names'];
  public name: string = "";
  public description: string = "";
  public externalLink: string = "";
  public website: string = "0";
  public category: string = "Collectibles";
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
    console.log(this.name);
  }

  blurDescriptionEvent(event: any) {
    this.description = event.target.value;
    console.log(this.description);
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
    this.spinner.show()
    console.log('e', e.target.files[0]);
    this.iconUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('iconUrl', this.iconUrl);
    this.spinner.hide()
  }

  async onBannerInput(e: any) {
    this.spinner.show()
    console.log('e', e.target.files[0]);
    this.bannerUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('bannerUrl', this.bannerUrl);
    this.spinner.hide()
  }

  async onFileInput(e: any) {
    this.spinner.show()
    console.log('e', e.target.files[0]);
    this.imageUrl = await this.ipfsDaemonService.uploadFile(e.target.files[0]);
    console.log('imageUrl', this.imageUrl);
    this.spinner.hide()
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
      customURL: this.externalLink,
      category: this.category,
      website: this.website,
      creatorWallet: this._walletsConnectService.sessionWallet!.getDefaultAccount()
    }

    this.spinner.show();
    console.log('param', param);
    this._userService.createCollection(param).subscribe(
      res => {
        console.log(res)
        this.spinner.hide();
        alert('Successfully added');
        this.router.navigateByUrl("/collection")
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
