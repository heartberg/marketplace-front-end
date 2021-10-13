import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})
export class MarketPlaceComponent implements OnInit {
  public categoriesDropDown: string[] = ['All NFTs', 'Art', 'Music', 'Packs', 'URLs', 'Real Estate'];
  public typesDropDown: string[] = ['All Types', 'Sale', 'Auction', 'Swap'];
  public collectionsDropDown: string[] = ['All Collections', 'Collection 1', 'Collection 2', 'Collection 3'];
  public artistsDropDown: string[] = ['All Artists', 'Artists 1', 'Artists 2',];
  public boxesSortDropDown: string[] = ['Sort by', 'Newest', 'Ending soon', 'Price high to low', 'Price low to high', 'Most viewed', 'Most liked']
  public boxArray: number[] = [1,1,1,2,2,3,4,4,4];

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
