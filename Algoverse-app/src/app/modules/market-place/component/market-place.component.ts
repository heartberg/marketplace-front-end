import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})
export class MarketPlaceComponent implements OnInit {
  categoriesDropDown: string[] = ['All NFTs', 'Art', 'Music', 'Packs', 'URLs', 'Real Estate'];
  typesDropDown: string[] = ['All Types', 'Sale', 'Auction', 'Swap'];
  collectionsDropDown: string[] = ['All Collections', 'Collection 1', 'Collection 2', 'Collection 3'];
  artistsDropDown: string[] = ['All Artists', 'Artists 1', 'Artists 2',];

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
