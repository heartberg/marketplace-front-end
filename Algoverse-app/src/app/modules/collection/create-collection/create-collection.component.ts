import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CollectionService} from "../../../services/collection.service";

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {
  form: any;
  dropDownValue: any = '';

  constructor(private fb: FormBuilder, private _collectionService: CollectionService) { }

  ngOnInit(): void {
    this.realizeForm();
  }

  realizeForm(): void {
      this.form = this.fb.group({
        icon: ['', Validators.required],
        banner: ['', Validators.required],
        featuredImage: ['', Validators.required],
        name: ['', Validators.required],
        description: ['', Validators.required],
        royalties: ['', Validators.required],
        customUrl: ['', Validators.required],
        category: ['', Validators.required],
        web: ['', Validators.required],
      });
  }

  sendForm(): void {
    const { icon } = this.form.value;
    const { banner } = this.form.value;
    const { featuredImage } = this.form.value;
    const { name } = this.form.value;
    const { description } = this.form.value;
    const { royalties } = this.form.value;
    const { customUrl } = this.form.value;
    const { category } = this.form.value;
    const { web } = this.form.value;

    this._collectionService.addCollection(
      {
        icon: icon,
        banner: banner,
        featuredImage: featuredImage,
        name: name,
        description: description,
        royalties: royalties,
        customUrl: customUrl,
        category: category,
        web: web,
        creator: {
          wallet: localStorage.getItem('wallet'),
        }
      }
    ).subscribe( (date) => console.log(date));

  }

  getDropDownValue(event: string) {
    this.dropDownValue = event;
  }

}
