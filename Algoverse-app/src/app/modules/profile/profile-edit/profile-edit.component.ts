import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup,} from "@angular/forms";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  //@ts-ignore
  myForm: FormGroup;
  constructor(private userServie: UserService, private fb: FormBuilder) { }

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
    const finalObj = Object.assign(obj, this.myForm.value);
    //@ts-ignore
    this.userServie.userUpdate(finalObj).subscribe( (item) => item);
  }
  onImageUpload(event: any) {
    let imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      this.myForm.get('bannerImage').value = reader.result as string;
    }
    reader.readAsDataURL(imageFile);
  }

  onProfileImageUpload(event: Event) {
    // @ts-ignore
    let imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      this.myForm.get('profileImage').value = reader.result as string;
    }
    reader.readAsDataURL(imageFile);
  }

  onFeaturedImageUpload(event: Event) {
    // @ts-ignore
    let imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      this.myForm.get('featuredImage').value = reader.result as string;
    }
    reader.readAsDataURL(imageFile);
  }
}
