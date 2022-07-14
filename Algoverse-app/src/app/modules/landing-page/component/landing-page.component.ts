import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public hotDropDown = ['Collections', 'Asset', 'Buyers', 'Sellers', 'Creators'];
  public hotInDropDown = ['1 Day', '7 Days', '30 Days', 'All Time',];
  public isLoaded:boolean = true;

  public featuredArtists = [];
  public hotItems: Array<any> = [];

  private loadingIndex = 0;
  private loadingsCount = 0;

  private hotType = "Collections";
  private lastDays = 1;

  constructor(
    private _userService: UserService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();

    this.loadingIndex = 0;
    this.loadingsCount = 0;

    this.loadingsCount++;
    this._userService.loadFeaturedArtists().subscribe(
      result => {
        console.log('featured artists', result);
        this.loadingIndex++;
        if (this.loadingIndex == this.loadingsCount) {
          this.spinner.hide();
        }
        this.featuredArtists = result;
      },
      err => {
        console.log(err);
        this.loadingIndex++;
        if (this.loadingIndex == this.loadingsCount) {
          this.spinner.hide();
        }
      }
    );

    this.loadingsCount++;
    this._userService.loadHotCollections(1).subscribe(
      result => {
        console.log('hot collections', result);
        this.loadingIndex++;
        if (this.loadingIndex == this.loadingsCount) {
          this.spinner.hide();
        }
        this.hotItems = this.setType(result, true, false, false);
      },
      err => {
        console.log(err);
        this.loadingIndex++;
        if (this.loadingIndex == this.loadingsCount) {
          this.spinner.hide();
        }
      }
    );

  }

  selectedType(collectionName: string) {
    this.hotType = collectionName;

    this.loadHotItems();
  }

  selectedLastDuration(lastDays: string) {
    if (lastDays == 'All Time') {
      this.lastDays = 0;
    }
    else if (lastDays == '30 Days') {
      this.lastDays = 30;
    }
    else if (lastDays == '7 Days') {
      this.lastDays = 7;
    }
    else if (lastDays == '1 Days') {
      this.lastDays = 1;
    }

    this.loadHotItems();
  }

  loadHotItems() {
    this.spinner.show();
    if (this.hotType == 'Collections') {
      this._userService.loadHotCollections(this.lastDays).subscribe(
        result => {
          console.log('hot collections', result);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
          this.hotItems = this.setType(result, true, false, false);
        },
        err => {
          console.log(err);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
        }
      )
    }
    else if (this.hotType == 'Asset') {
      this._userService.loadHotAssets(this.lastDays).subscribe(
        result => {
          console.log('hot collections', result);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
          this.hotItems = this.setType(result, false, true, false);
        },
        err => {
          console.log(err);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
        }
      )
    }
    else if (this.hotType == 'Buyers') {
      this._userService.loadHotBuyers(this.lastDays).subscribe(
        result => {
          console.log('hot collections', result);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
          this.hotItems = this.setType(result, false, false, true);
        },
        err => {
          console.log(err);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
        }
      )
    }
    else if (this.hotType == 'Sellers') {
      this._userService.loadHotSellers(this.lastDays).subscribe(
        result => {
          console.log('hot collections', result);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
          this.hotItems = this.setType(result, false, false, true);
        },
        err => {
          console.log(err);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
        }
      )
    }
    else if (this.hotType == 'Creators') {
      this._userService.loadHotCreators(this.lastDays).subscribe(
        result => {
          console.log('hot collections', result);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
          this.hotItems = this.setType(result, false, false, true);
        },
        err => {
          console.log(err);
          this.loadingIndex++;
          if (this.loadingIndex == this.loadingsCount) {
            this.spinner.hide();
          }
        }
      )
    }
  }

  setType = (data: Array<any>, isCollection: boolean, isAsset: boolean, isUser: boolean) => {
    let result = [];
    if (isCollection) {
      for (let item of data) {
        item['isCollection'] = true;
        result.push(item);
      }
    }
    if (isAsset) {
      for (let item of data) {
        item['isAsset'] = true;
      result.push(item);
      }
    }
    if (isUser) {
      for (let item of data) {
        item['isUser'] = true;
        result.push(item);
      }
    }
    return result;
  }


}
