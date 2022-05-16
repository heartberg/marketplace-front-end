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

}
