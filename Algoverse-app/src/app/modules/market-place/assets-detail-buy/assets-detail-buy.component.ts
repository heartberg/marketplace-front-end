import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assets-detail-buy',
  templateUrl: './assets-detail-buy.component.html',
  styleUrls: ['./assets-detail-buy.component.scss']
})
export class AssetsDetailBuyComponent implements OnInit {
  isPopUp: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openPopUp():void {
    this.isPopUp = true;
  }

  closePopUp(): void {
    this.isPopUp = false;
  }
}
