import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auction-grid-item',
  templateUrl: './auction-grid-item.component.html',
  styleUrls: ['./auction-grid-item.component.scss']
})
export class AuctionGridItemComponent implements OnInit {

  @Input() mItem: any = {};
  isCollection: boolean = false;

  constructor() {}

  ngOnInit(): void {
    
  }

  scaleAlgo(amount: number) {
    return (amount / Math.pow(10, 6)).toFixed(2)
  }

}
