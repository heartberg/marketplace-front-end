import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Observable, of} from "rxjs";
import {AssetService} from "../../../services/asset.service";
import {CollectionService} from "../../../services/collection.service";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public hotDropDown = ['Buyers', 'Item', 'Collections', 'Sellers', 'Creators'];
  public hotInDropDown = ['1 Day', '7 Days', '30 Days', 'All Time',];
  exampleArr = [1,2,3,4];
  public isLoaded:boolean = false;

  private dropDownItemValue: string = '';
  private dropDownDaysValue: any = '';

  // drop down array
  HotArray$: Observable<any> = of('');

  constructor(
    private _userService: UserService,
    private _assetService: AssetService,
    private _collectionService: CollectionService
  ) { }

  ngOnInit(): void {
    this.HotArray$ = this._userService.getHotCreators(1);
    setTimeout( () => {
      this.isLoaded = true;
    },1000)
  }

  getDropDownValue(dropDownValue: string) {
    this.dropDownItemValue = dropDownValue;
  }

  getDropDownDaysValue(dropDownDaysValue:any) {
    if (dropDownDaysValue === '1 Day') {
      this.dropDownDaysValue = 1;
    } else if (dropDownDaysValue === '7 Days') {
      this.dropDownDaysValue = 7;
    } else if (dropDownDaysValue === '30 Days') {
      this.dropDownDaysValue = 30;
    } else if (dropDownDaysValue === 'All Time') {
      this.dropDownDaysValue = -1;
    }
    if (this.dropDownItemValue === 'Creators') {
      this.HotArray$ = this._userService.getHotCreators(this.dropDownDaysValue);
    } else if (this.dropDownItemValue === 'Buyers') {
      this.HotArray$ = this._userService.getHotBuyers(this.dropDownDaysValue);
    } else if (this.dropDownItemValue === 'Sellers') {
      this.HotArray$ = this._userService.getHotSellers(this.dropDownDaysValue);
    } else if (this.dropDownItemValue === 'Item') {
      this.HotArray$ = this._assetService.getAssetBuyers(this.dropDownDaysValue);
    } else if (this.dropDownItemValue === 'Collections') {
      this.HotArray$ = this._collectionService.getHotCollections(this.dropDownDaysValue);
    }
  }

}
