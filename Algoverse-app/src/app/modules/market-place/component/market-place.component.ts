import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})
export class MarketPlaceComponent implements OnInit {
  public typesDropDown: string[] = ['All Types', 'Trade', 'Bid', 'Swap', 'Auction'];
  public categoriesDropDown: string[] = ['All NFTs', 'Collectible items', 'Artwork', 'Event tickets', 'Music and media', 'Gaming', 'Big Sports Moments', 'Virtual Fashion', 'Real-world assets', 'Memes', 'Domain names'];
  public collectionsDropDown: string[] = ['All Collections'];
  public artistsDropDown: string[] = ['All Artists'];
  public sortDropDown: string[] = ['Newest', 'Ending soon', 'Price high to low', 'Price low to high', 'Most viewed', 'Most liked'];

  public trades: any[] = [];
  public bids: any[] = [];
  public swaps: any[] = [];
  public auctions: any[] = [];

  //drop down value
  public dropDownValue: string = '';
  public isSwap: boolean = false;
  public isSale: boolean = false;
  public isAll: boolean = true;
  public isTimedAuction: boolean = false;

  public isLoaded: boolean = false;
  public type: string = 'All Types';
  public category: string = 'All NFTs';
  public collection: string = 'All Collections';
  public artist: string = 'All Artists';
  public sort: string = 'Newest';

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  constructor(
    private router: Router,
    private _userService: UserService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
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

  selectedCategory(collectionName: string) {
    this.collection = collectionName;
  }

  selectedCollection(collectionName: string) {
    this.passedCollection = this._stateService.getCollectionByName(collectionName);
  }

  selectedCollection(collectionName: string) {
    this.passedCollection = this._stateService.getCollectionByName(collectionName);
  }

  selectedCollection(collectionName: string) {
    this.passedCollection = this._stateService.getCollectionByName(collectionName);
  }

}
