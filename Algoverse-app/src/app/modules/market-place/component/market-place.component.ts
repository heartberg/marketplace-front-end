import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { UserService } from 'src/app/services/user.service';

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

  public trades: number[] = [];
  public bids: number[] = [];
  public swaps: number[] = [];
  public auctions: number[] = [];

  //drop down value
  public dropDownValue: string = '';
  public isSwap: boolean = false;
  public isSale: boolean = false;
  public isAll: boolean = true;
  public isTimedAuction: boolean = false;

  public isLoaded: boolean = false;

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  constructor(
    private router: Router,
    private _userService: UserService
  ) {
  }

  ngOnInit(): void {
    this._userService.loadTrendingItems().subscribe(
      res => {
        this.isLoaded = true;
        console.log(res);

        this.trades = res.trades;
        this.bids = res.bids;
        this.swaps = res.swaps;
        this.auctions = res.auctions;
      },
      err => {
        console.log(err);
      }
    )
  }

  catchValue(event: string) {
   this.dropDownValue = event;

    if(this.dropDownValue == 'Sale') {
      this.isSale = true;
      this.isSwap = false;
      this.isTimedAuction = false;
      this.isAll = false;
      this.router.navigate(['marketplace/sale'])

    } else if (this.dropDownValue == 'Auction') {
      this.isSale = false;
      this.isSwap = false;
      this.isTimedAuction = true;
      this.isAll = false;
      this.router.navigate(['marketplace/auction'])

    } else if (this.dropDownValue == 'Swap') {
      this.isSale = false;
      this.isTimedAuction = false;
      this.isSwap = true;
      this.isAll = false;
      this.router.navigate(['marketplace/swap'])

    } else if (this.dropDownValue == 'All Types') {
      this.isAll = true;
      this.router.navigate(['marketplace/all-types'])
    }
  }
}
