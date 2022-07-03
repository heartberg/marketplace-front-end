import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

@Component({
  selector: 'app-drop-down-selector',
  templateUrl: './drop-down-selector.component.html',
  styleUrls: ['./drop-down-selector.component.scss']
})
export class DropDownSelectorComponent implements OnInit {
  @Input() public dropDownValues: string[] = [];
  @Input() public defaultValue: string = "";

  @Input() public isNotAccordion: boolean = true;
  @Input() public treeDots: boolean = false;
  // profile
  @Input() public isProfileSection: boolean = false;
  @Input() public profileSectionImg: string = ''
  @Input() public profileSectionInfo: string = ''
  // profile
  @Input() public tree: boolean = false;
  @Input() public hasTitle: string  = '';

  @Output() dropDownValue = new EventEmitter<string>();

  public isDropDownOpened = false;
  public isDropDownOpenedCounter = 1;
  public showDropDownSelected: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showDropDownSelected = this.defaultValue?this.defaultValue:(this.dropDownValues.length>0?this.dropDownValues[0]:'')
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
    this.dropDownValue.emit(value);
  }

}
