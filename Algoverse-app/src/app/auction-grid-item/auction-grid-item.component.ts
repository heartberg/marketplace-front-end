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

  formatDate(timestamp: number): string {
    let date = new Date(timestamp * 1000)
    //console.log(date)
    let minutes = date.getMinutes().toString()
    if(date.getMinutes() < 10) {
      minutes = "0" + minutes
    }
    let hours = date.getHours().toString()
    if(date.getHours() < 10){
      hours = "0" + hours
    }
    return date.toDateString() + " - " + hours + ":" + minutes
  }

}
