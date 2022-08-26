import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../services/search.service";
import {Location} from "@angular/common";
import {SearchFilterEnum} from "../../models";
import {RouterService} from "../../services/router.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.scss']
})
export class SearchWrapperComponent implements OnInit {
  public searchResult: any;
  public searchValue: string = "";
  public filteredSearchResult: any;

  public searchFilterEnum: typeof SearchFilterEnum = SearchFilterEnum;
  public selectedSearchFilterType: SearchFilterEnum = SearchFilterEnum.NFT;

  constructor(
    private readonly _searchService: SearchService,
    private readonly _location: Location,
    private readonly _routerService: RouterService,
    private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.subscribeToSearchResult();
  }

  private subscribeToSearchResult(): void {
    this._searchService.$searchResult.subscribe(result => {
      if (result) {
        console.log(result)
        this.searchResult = result;
        this.filteredSearchResult = result.assets;
      } else {
        const previousUrl = this._routerService.getPreviousUrl();
        this._router.navigateByUrl(previousUrl);
      }
    })
    this._searchService.$searchValue.subscribe((result: string) => {
      this.searchValue = result;
    })
  }

  public changeSearchFilterType(type: SearchFilterEnum): void {
    this.selectedSearchFilterType = type;
    switch (type) {
      case SearchFilterEnum.COLLECTION: {
        this.filteredSearchResult = this.searchResult.collections;
        break;
      }
      case SearchFilterEnum.PROFILE: {
        this.filteredSearchResult = this.searchResult.users;
        break;
      }
      default: {
        this.filteredSearchResult = this.searchResult.assets;
      }
    }
  }
}
