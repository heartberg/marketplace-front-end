import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {TradeService} from "../../../../services/trade.service";

@Component({
  selector: 'app-create-trade',
  templateUrl: './create-trade.component.html',
  styleUrls: ['./create-trade.component.scss']
})
export class CreateTradeComponent implements OnInit {
  tradeForm: any;
  dropDownValue: string = '';

  constructor(
    private fb: FormBuilder,
    private _tradeService: TradeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.tradeForm = this.fb.group({
      asset: ['', Validators.required],
      description: ['', Validators.required],
      royalties: ['', Validators.required],
      collectionName: ['', Validators.required],
      height: ['', Validators.required],
      speed: ['', Validators.required],
      amount: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  createTrade() {
    console.log(this.tradeForm.value);
    this.tradeForm.reset();
    // this._tradeService.createTrade('data')
    //   .subscribe(
    //     (data) => console.log(data)
    //   );
  }

  getDropDownValue(event: string) {
    this.dropDownValue = event;
  }
}
