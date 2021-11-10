import { Component, OnInit } from '@angular/core';
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

@Component({
  selector: 'app-asset-detail-swap',
  templateUrl: './asset-detail-swap.component.html',
  styleUrls: ['./asset-detail-swap.component.scss']
})
export class AssetDetailSwapComponent implements OnInit {
  isPopUp: boolean = false;
  isPopUpSecond: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openPopUp():void {
    this.isPopUp = true;
  }

  openPopUpSecond(): void {
    this.isPopUpSecond = true;
  }

  closePopUp(): void {
    this.isPopUp = false;
    this.isPopUpSecond = false;
  }

  closePopUpSecond(): void {
    this.isPopUpSecond = false
  }
}
