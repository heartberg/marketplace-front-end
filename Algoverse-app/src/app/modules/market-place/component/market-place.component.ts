import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SwapService} from "../../../services/swap.service";
import {AuctionService} from "../../../services/auction.service";
import {AssetService} from "../../../services/asset.service";
import {ArtistService} from "../../../services/artist.service";
import {CollectionService} from "../../../services/collection.service";
import {CollectionAllMarkeplaceObj, CollectionAllMarketplace} from "../../../models/collection-hot.model";
import {ArtistsModel, ArtistsModelObj} from "../../../models/artists.model";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})
export class MarketPlaceComponent implements OnInit {
  public categoriesDropDown: string[] = ['All NFTs', 'Art', 'Music', 'Packs', 'URLs', 'Real Estate'];
  public typesDropDown: string[] = ['All Types', 'Sale', 'Auction', 'Swap'];

  // coming from api
  // @ts-ignore
  public collectionsDropDown: CollectionAllMarkeplaceObj[];
  // @ts-ignore
  public artistsDropDown: ArtistsModelObj[];
  // coming from api

  public boxesSortDropDown: string[] = ['Sort by', 'Newest', 'High Price', 'Low Price', 'Most liked']
  public boxArray: number[] = [1, 1, 1, 2, 2, 3, 4, 4, 4];

  // main variables
  //drop down value
  public dropDownValue: string = '';
  //drop down filtring value
  public dropDownFiltringValue: string = '';
  // drop down by collectionId
  public collectionId: any = '00000000-0000-0000-0000-000000000000';
  // drop down by wallet
  public wallet: string = '';
  // minPrice
  public minPrice: number | string = '';
  public maxPrice: number | string = '';
  // #main variables

  public serviceMethod$: Observable<any> = of('');
  public isSwap: boolean = false;
  public isSale: boolean = false;
  public isAll: boolean = true;
  public isTimedAuction: boolean = false;
  public isScaled: boolean = false;
  public isLoaded: boolean = false;

  // artists and collections

  public passedEitherArtist: boolean = false;
  public passedEitherCollection: boolean = false

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  constructor(
    private router: Router,
    private _swapService: SwapService,
    private _auctionService: AuctionService,
    private _assetService: AssetService,
    private _artistService: ArtistService,
    private _collectionService: CollectionService,
    private _userService: UserService
  ) {
  }

  scaleContent() {
    this.isScaled = !this.isScaled;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000)
    this._artistService.getAllArtists()
      .subscribe(
        (data) => this.artistsDropDown = data
      );
    this._collectionService.getAllCollectionMarketPlace().subscribe(
      (data) => this.collectionsDropDown = data
    );
  }

  catchValue(event: string) {
    this.dropDownValue = event;

    if (this.dropDownValue == 'Sale') {
      this.isSale = true;
      this.isSwap = false;
      this.isTimedAuction = false;
      this.isAll = false;
      this.router.navigate(['marketplace/sale'])
      this._assetService.getAllAssetMarketplace(1,).subscribe((data) => console.log(data))

    } else if (this.dropDownValue == 'Auction') {
      this.isSale = false;
      this.isSwap = false;
      this.isTimedAuction = true;
      this.isAll = false;
      this.router.navigate(['marketplace/auction'])
      this._auctionService.getAllAuctionMarketplace(1).subscribe((data) => console.log(data))

    } else if (this.dropDownValue == 'Swap') {
      this.isSale = false;
      this.isTimedAuction = false;
      this.isSwap = true;
      this.isAll = false;
      this.router.navigate(['marketplace/swap'])
      this._swapService.getAllSwapMarketplace(1).subscribe((data) => console.log(data))

    } else if (this.dropDownValue == 'All Types') {
      this.isAll = true;
      this.router.navigate(['marketplace/all-types'])
    }
  }

  getCollections($event: string) {
    this.passedEitherArtist = false;
    this.passedEitherCollection = true;

    // this.artistsDropDownDefaultName = 'All Artists';

    this.collectionId = $event;
    this.wallet = '';
    this.returnCorrectApiMethod
    (
      this.dropDownValue, this.returnInputOrderingValue(this.dropDownFiltringValue),
      this.wallet, this.collectionId, this.minPrice, this.maxPrice
    )
  }

  getArtists($event: string) {
    this.passedEitherArtist = true;
    this.passedEitherCollection = false;

    // this.collectionDropDownDefaultName = 'All Collections';

    this.wallet = $event;
    this.collectionId = '00000000-0000-0000-0000-000000000000';

    // this.collectionId = $event;
    // this.wallet = '';
    // this.returnCorrectApiMethod
    // (
    //   this.dropDownValue, this.returnInputOrderingValue(this.dropDownFiltringValue),
    //   this.wallet, this.collectionId, this.minPrice, this.maxPrice
    // )
  }

  // get type values properties
  returnCorrectApiMethod(typesValue: string, orderingValue?: any, wallet?: any, collectionId?: any, minPrice?: any, maxPrice?: any): any {
    if (typesValue == 'Swap') {
      this._swapService.getAllSwapMarketplace(1)
        .subscribe(
          (date:any) => console.log(date)
        );
    } else if (typesValue == 'Sale') {
      this._assetService.getAllAssetMarketplaceBySort(1, orderingValue, wallet, collectionId)
        .subscribe(
          (date:any) => console.log(date)
        );
    } else if (typesValue == 'Auction') {
      this._auctionService.getAllAuctionMarketplaceOrdering(1, orderingValue)
        .subscribe(
          (date:any) => console.log(date)
        );
    }
  }

  returnInputOrderingValue(orderingValue: string): any {
    if (orderingValue == 'Newest') {
      return 'newest'
    } else if (orderingValue == 'High Price') {
      return 'high_price'
    } else if (orderingValue == 'Low Price') {
      return 'low_price'
    } else if (orderingValue == 'Most liked') {
      return 'likes'
    } else {
      return '';
    }
  }

  catchOrderingValue(event: any): void {
    this.dropDownFiltringValue = event;
    this.returnCorrectApiMethod(this.dropDownValue, this.returnInputOrderingValue(this.dropDownFiltringValue), this.wallet, this.collectionId, this.minPrice, this.maxPrice)
  }

}
