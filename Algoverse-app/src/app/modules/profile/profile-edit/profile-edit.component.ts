import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IpfsDaemonService} from 'src/app/services/ipfs-daemon.service';
import {Location} from '@angular/common';
import {WalletsConnectService} from 'src/app/services/wallets-connect.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {StateService} from "../../../services/state.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    private spinner: NgxSpinnerService,
    private router: Router,
    private readonly _stateService: StateService,
    private readonly _snackBar: MatSnackBar
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
    let addr = wallet?.getDefaultAccount();
    const profileDataFromState = this._stateService.getEditProfileData;
    if(addr) {
        this.userService.loadProfile(addr).subscribe(
        (res: any) => {
          this.userProfile = res
          console.log(this.userProfile)

          if (profileDataFromState) {
            this.profileBannerUrl = profileDataFromState.bannerImage;
            this.profileIconUrl = profileDataFromState.profileImage;
            this.profileFeaturedUrl = profileDataFromState.featuredImage;

            this.myForm.get("name")?.setValue(profileDataFromState.name);
            this.myForm.get("bio")?.setValue(profileDataFromState.bio);
            this.myForm.get("customURL")?.setValue(profileDataFromState.customURL);
            this.myForm.get("twitter")?.setValue(profileDataFromState.twitter);
            this.myForm.get("telegram")?.setValue(profileDataFromState.telegram);
            this.myForm.get("instagram")?.setValue(profileDataFromState.instagram);
            this.myForm.get("website")?.setValue(profileDataFromState.website);

            this._snackBar.open('Draft applied', undefined, {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: 'custom-snackbar'
            });
          } else {
            this.profileBannerUrl = this.userProfile.bannerImage;
            this.profileIconUrl = this.userProfile.profileImage;
            this.profileFeaturedUrl = this.userProfile.featuredImage;

            this.myForm.get("name")?.setValue(this.userProfile.name);
            this.myForm.get("bio")?.setValue(this.userProfile.bio);
            this.myForm.get("customURL")?.setValue(this.userProfile.customURL);
            this.myForm.get("twitter")?.setValue(this.userProfile.twitter);
            this.myForm.get("telegram")?.setValue(this.userProfile.telegram);
            this.myForm.get("instagram")?.setValue(this.userProfile.instagram);
            this.myForm.get("website")?.setValue(this.userProfile.website);
          }
        }
      )
    }
  }

  saveForm() {
    this.spinner.show();
    const finalObj = this.createDataObject();

    this.userServie.userUpdate(finalObj).subscribe( (item) => {
      if(item) {
        console.log(item)
        if(item.status == 0) {
          alert("Error updating profile!")
        } else {
          alert("Updated profile!")
          this.router.navigateByUrl("/profile/" + this.userProfile.wallet)
        }
      }
    });
    this.spinner.hide();
  }

  async onImageUpload(event: any) {
    console.log('e', event.target.files[0]);
    this.spinner.show();
    this.profileBannerUrl = await this.ipfs.uploadFile(event.target.files[0]);
    this.spinner.hide();
    console.log(this.profileBannerUrl)
  }

  async onProfileImageUpload(event: any) {
    console.log('e', event.target.files[0]);
    this.spinner.show();
    this.profileIconUrl = await this.ipfs.uploadFile(event.target.files[0]);
    this.spinner.hide();
    console.log(this.profileIconUrl)
  }

  async onFeaturedImageUpload(event: any) {
    console.log('e', event.target.files[0]);
    this.spinner.show();
    this.profileFeaturedUrl = await this.ipfs.uploadFile(event.target.files[0]);
    this.spinner.hide();
    console.log(this.profileFeaturedUrl)
  }

  back() {
    this._location.back()
  }

  public createDataObject(): any {
    const wallet = localStorage.getItem('wallet');
    const verified = this.userProfile.verified;
    const obj = {
      wallet,
      verified,
    };
    const finalObj = Object.assign(obj, this.myForm.value);
    finalObj.profileImage = this.profileIconUrl;
    finalObj.bannerImage = this.profileBannerUrl;
    finalObj.featuredImage = this.profileFeaturedUrl;

    return finalObj
  }

  public navigateToGetVerified(): void {
    if (this.myForm.dirty) {
      this._stateService.setEditProfileData = this.createDataObject();
      this._snackBar.open('Draft saved', undefined, {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'custom-snackbar'
      });
    }

    this.router.navigate(['/get-verified'])
  }
}
