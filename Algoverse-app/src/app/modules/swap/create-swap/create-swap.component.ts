import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {SwapService} from "../../../services/swap.service";

@Component({
  selector: 'app-create-swap',
  templateUrl: './create-swap.component.html',
  styleUrls: ['./create-swap.component.scss']
})
export class CreateSwapComponent implements OnInit {
  swapForm: any;
  dropDownValue: string = '';
  dropDownValueSecond: string = '';

  constructor(
    private fb: FormBuilder,
    private _swapService: SwapService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.swapForm = this.fb.group({
      asset: ['', Validators.required],
      amount: ['', Validators.required],
      description: ['', Validators.required],
      assetDescription: ['', Validators.required],
      royalties: ['', Validators.required],
      collectionName: ['', Validators.required],
      height: ['', Validators.required],
      speed: ['', Validators.required],
      assetInfo: ['', Validators.required],
      collection: ['', Validators.required],
    });
  }

  createTrade() {
    console.log(this.swapForm.value);
    this.swapForm.reset();
    // this._swapService.createSwap('data')
    //   .subscribe(
    //     (data) => console.log(data)
    //   );
  }

  getDropDownValue(event: string) {
    this.dropDownValue = event;
  }

  getDropDownValueSecond(event: string) {
    this.dropDownValueSecond = event;
  }
}
