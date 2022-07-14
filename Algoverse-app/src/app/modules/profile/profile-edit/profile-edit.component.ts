import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup,} from "@angular/forms";
import { IpfsDaemonService } from 'src/app/services/ipfs-daemon.service';

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


  constructor(
    private userServie: UserService, 
    private fb: FormBuilder,
    private ipfs: IpfsDaemonService
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
  }

  saveForm() {
    // @ts-ignore
    const wallet = localStorage.getItem('wallet');
    const verified = false;
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
}
