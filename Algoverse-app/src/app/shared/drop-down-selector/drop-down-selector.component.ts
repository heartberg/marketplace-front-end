import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

@Component({
  selector: 'app-drop-down-selector',
  templateUrl: './drop-down-selector.component.html',
  styleUrls: ['./drop-down-selector.component.scss']
})
export class DropDownSelectorComponent implements OnInit {
  @Input() public dropDownValues: string[] = [];
  @Input() public isNotAccordion: boolean = true;
  @Input() public treeDots: boolean = false;

  @Input() public tree: boolean = false;
  @Input() public hasTitle: string  = '';

  public isDropDownOpened = false;
  public isDropDownOpenedCounter = 1;
  public showDropDownSelected: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
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

}
