import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup,} from "@angular/forms";
import { IpfsDaemonService } from 'src/app/services/ipfs-daemon.service';
import { Location } from '@angular/common';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  //@ts-ignore
  myForm: FormGroup;
  profileIconUrl: string | undefined;
  profileBannerUrl: string | undefined;
  profileFeaturedUrl: string | undefined;
  userProfile: any;


  constructor(
    private userServie: UserService, 
    private fb: FormBuilder,
    private ipfs: IpfsDaemonService,
    private _location: Location,
    private userService: UserService,
    private connectService: WalletsConnectService,
    ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: [''],
      bio: [''],
      profileImage: [''],
      bannerImage: [''],
      featuredImage: [''],
      customURL: [''],
      twitter: [''],
      telegram: [''],
      instagram: [''],
      website: ['']
    })

    let wallet = this.connectService.sessionWallet
    let addr = wallet?.getDefaultAccount()
    if(addr) {
      this.userService.loadProfile(addr).subscribe(
        (res: any) => {
          this.userProfile = res
          console.log(this.userProfile)

          this.profileBannerUrl = this.userProfile.bannerImage
          this.profileIconUrl = this.userProfile.profileImage
          this.profileFeaturedUrl = this.userProfile.featuredImage

          this.myForm.get("name")?.setValue(this.userProfile.name)
          this.myForm.get("bio")?.setValue(this.userProfile.bio)
          this.myForm.get("customURL")?.setValue(this.userProfile.customURL)
          this.myForm.get("twitter")?.setValue(this.userProfile.twitter)
          this.myForm.get("telegram")?.setValue(this.userProfile.telegram)
          this.myForm.get("instagram")?.setValue(this.userProfile.instagram)
          this.myForm.get("website")?.setValue(this.userProfile.website)
        }
      )
    }
  }

  saveForm() {
    // @ts-ignore
    const wallet = localStorage.getItem('wallet');
    const verified = this.userProfile.verified;
    const obj = {
      wallet: wallet,
      verified: verified,
    }
    let finalObj = Object.assign(obj, this.myForm.value);
    finalObj.profileImage = this.profileIconUrl
    finalObj.bannerImage = this.profileBannerUrl
    finalObj.featuredImage = this.profileFeaturedUrl
    console.log(finalObj)
    //@ts-ignore
    this.userServie.userUpdate(finalObj).subscribe( (item) => item);
  }

  async onImageUpload(event: any) {
    console.log('e', event.target.files[0]);
    this.profileBannerUrl = await this.ipfs.uploadFile(event.target.files[0]);
    console.log(this.profileBannerUrl)
  }

  async onProfileImageUpload(event: any) {
    console.log('e', event.target.files[0]);
    this.profileIconUrl = await this.ipfs.uploadFile(event.target.files[0]);
    console.log(this.profileIconUrl)
  }

  async onFeaturedImageUpload(event: any) {
    console.log('e', event.target.files[0]);
    this.profileFeaturedUrl = await this.ipfs.uploadFile(event.target.files[0]);
    console.log(this.profileFeaturedUrl)
  }

  back() {
    this._location.back()
  }
}
