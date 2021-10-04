import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-drop-down-selector',
  templateUrl: './drop-down-selector.component.html',
  styleUrls: ['./drop-down-selector.component.scss']
})
export class DropDownSelectorComponent implements OnInit {
  @Input() public dropDownValues: string[] = [];
  public isDropDownOpened = false;
  public isDropDownOpenedCounter = 1;
  public showDropDownSelected: string = '';

  public isMarketPlaceUrl: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkRouteForMarketplace();
  }

  openDropDown() {
    this.isDropDownOpenedCounter += 1;
    if (this.isDropDownOpenedCounter % 2 === 0) {
      this.isDropDownOpened = true;
    } else {
      this.isDropDownOpened = false;
    }
  }

  selectValue(value: string) {
    this.isDropDownOpenedCounter +=1;
    this.showDropDownSelected = value
    this.isDropDownOpened = false;
  }

  checkRouteForMarketplace(): void {
    let marketplaceRoute = this.route.snapshot.url[0].path;
    if (marketplaceRoute === 'marketplace') {
      console.log(true)
      this.isMarketPlaceUrl = true;
    }
  }
}
