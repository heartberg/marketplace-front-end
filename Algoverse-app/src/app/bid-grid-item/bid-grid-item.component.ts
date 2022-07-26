import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bid-grid-item',
  templateUrl: './bid-grid-item.component.html',
  styleUrls: ['./bid-grid-item.component.scss']
})
export class BidGridItemComponent implements OnInit {

  @Input() mItem: any = {};
  isCollection: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
