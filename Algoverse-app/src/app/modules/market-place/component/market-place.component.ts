import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSliderChange } from '@angular/material/slider';
import { Options, LabelType } from '@angular-slider/ngx-slider';

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
  public sortDropDown: string[] = ['Newest', 'Ending soon', 'Price high to low', 'Price low to high','Stars'];

  public trades: any[] = [];
  public bids: any[] = [];
  public swaps: any[] = [];
  public auctions: any[] = [];
  public collections: any[] = [];
  public artists: any[] = [];

  //drop down value
  public dropDownValue: string = '';
  public isSwap: boolean = false;
  public isSale: boolean = false;
  public isAll: boolean = true;
  public isTimedAuction: boolean = false;

  public isLoaded: boolean = false;
  public type: string = 'all';
  public category: string = '';
  public collection: string = '';
  public artist: string = '';
  public sort: string = 'Newest';
  public lowPrice: number = 0;
  public highPrice: number = 10000;

  public options: Options = {
    floor: 0,
    ceil: 10000,
    // translate: (value: number, label: LabelType): string => {
    //   switch (label) {
    //     case LabelType.Low:
    //       return "<b>Min price:</b> $" + value;
    //     case LabelType.High:
    //       return "<b>Max price:</b> $" + value;
    //     default:
    //       return "$" + value;
    //   }
    // }
  };

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
        this.spinner.hide();

        this.trades = res.trades;
        this.bids = res.bids;
        this.swaps = res.swaps;
        this.auctions = res.auctions;

        this.collections = res.collections;
        for (let item of res.collections) {
          this.collectionsDropDown.push(item.name);
        }

        this.artists = res.artists;
        for (let item of res.artists) {
          this.artistsDropDown.push(item.name);
        }
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  onInputChange(event: MatSliderChange) {
    console.log('event.value', event.value);
  }

  selectedCategory(category: string) {
    if (category == 'All NFTs') {
      this.category = '';
    } else {
      this.category = category;
    }

    this.searchItems();
  }

  selectedType(type: string) {
    if (type == "All Types") {
      this.type = "all";
    }
    else if (type == "Trade") {
      this.type = "trade";
    }
    else if (type == "Bid") {
      this.type = "bid";
    }
    else if (type == "Swap") {
      this.type = "swap";
    }
    else if (type == "Auction") {
      this.type = "auction";
    }

    this.searchItems();
  }

  selectedCollection(collectionName: string) {
    if (collectionName == 'All Collections') {
      this.collection = '';

    } else {
      for (let item of this.collections) {
        if (item.name == collectionName) {
          this.collection = item.collectionId;
        }
      }
    }

    this.searchItems();
  }

  selectedArtist(artistName: string) {
    if (artistName == 'All Artists') {
      this.artist = '';
    } else {
      this.artist = artistName;
    }

    this.searchItems();
  }

  selectedSort(sortOption: string) {
    this.sort = sortOption;

    this.searchItems();
  }

  sliderEvent() {
    this.searchItems();
  }

  async searchItems() {
    this.spinner.show();
    console.log('type', this.type);
    console.log('category', this.category);
    console.log('collection', this.collection);
    console.log('artist', this.artist);
    console.log('lowPrice', this.lowPrice);
    console.log('highPrice', this.highPrice);
    console.log('sort', this.sort);
    
    this._userService.search(this.type, "", "", this.category, this.collection, this.artist, this.lowPrice * Math.pow(10, 6), this.highPrice * Math.pow(10, 6), this.sort).subscribe(
      res => {
        this.spinner.hide();

        this.trades = res.trades;
        this.bids = res.bids;
        this.swaps = res.swaps;
        this.auctions = res.auctions;
      },
      err => {
        this.spinner.hide();
        console.log('err', err);
      }
    );
  }

}
