import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trade-grid-item',
  templateUrl: './trade-grid-item.component.html',
  styleUrls: ['./trade-grid-item.component.scss']
})
export class TradeGridItemComponent implements OnInit {

  @Input() mItem: any = {};
  isCollection: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
