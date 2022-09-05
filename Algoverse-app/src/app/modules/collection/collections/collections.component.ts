import { Component, OnInit } from '@angular/core';
import {MarketplaceTypeEnum} from "../../../models";
import {Options} from "@angular-slider/ngx-slider";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatSliderChange} from "@angular/material/slider";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  public categoriesDropDown: string[] = ['All Collections', 'Collectibles', 'Artwork', 'Tickets', 'Music', 'Media', 'Gaming', 'Wearable', 'Physical assets', 'Domain names'];
  public artistsDropDown: string[] = ['All Creators'];
  public sortDropDown: string[] = ['Newest', 'Volume', 'A-Z', 'Likes'];

  public collections: any[] = [];
  public artists: any[] = [];

  private artist: string = '';
  private category: string = '';
  private sortBy: string = 'Newest';

  constructor(
    private router: Router,
    private _userService: UserService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getCollections();
    this.receiveTrendingArtists();
  }

  public selectedSort(sortBy: string): void {
    this.sortBy = sortBy;
    if (sortBy === 'Likes') {
      this.sortBy = 'MostLikes';
    }
    this.searchForCollection();
  }

  public selectedCategory(category: string): void {
    this.category = category;
    if (category === 'All Collections') {
      this.category = '';
    }
    this.searchForCollection();
  }

  public selectedArtist(name: string): void {
    if (name === 'All Creators') {
      this.artist = '';
      this.searchForCollection();
      return;
    }
    const artistInfo = this.artists.find(artist => artist.name === name);
    this.artist = artistInfo.wallet;
    this.searchForCollection();
  }

  public getCollections(): void {
    this._userService.searchForCollections().subscribe(collections => {
      this.spinner.hide();
      this.collections = collections;
    }, error => {
      this.spinner.hide();
      console.log(error);
    })
  }

  private receiveTrendingArtists(): void {
    this._userService.loadTrendingItems().subscribe(trending => {
      this.artists = trending.artists;
      this.artistsDropDown = [...this.artistsDropDown, ...trending.artists.map((artist: any) => artist.name)];
    });
  }

  private searchForCollection(): void {
    this.spinner.show();
    const params = {
      creator: this.artist,
      category: this.category,
      sortBy: this.sortBy
    };
    this._userService.searchForCollections(params).subscribe(collections => {
      this.spinner.hide();
      this.collections = collections;
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
}
