import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

@Component({
  selector: 'app-drop-down-selector',
  templateUrl: './drop-down-selector.component.html',
  styleUrls: ['./drop-down-selector.component.scss']
})
export class DropDownSelectorComponent implements OnChanges {
  @Input() public dropDownValues: string[] = [];
  @Input() public dropDownValuesWithLabels: any[] = [];
  @Input() public defaultValue: string = "";

  @Input() public isCategoryDisabled: boolean = false;
  @Input() public isNotAccordion: boolean = true;
  @Input() public treeDots: boolean = false;
  // profile
  @Input() public isProfileSection: boolean = false;
  @Input() public profileSectionImg: string = ''
  @Input() public profileSectionInfo: string = ''
  // profile
  // switcher
  @Input() public isSwitcher: boolean = false;
  // #switcher
  @Input() public tree: boolean = false;
  @Input() public hasTitle: string = '';
  @Input() public widthPX: string = ''
  @Output() dropDownValue = new EventEmitter<string>();
  @Output() switcherEmit = new EventEmitter<any>();
  public isDropDownOpened = false;
  public isDropDownOpenedCounter = 1;
  public showDropDownSelected: string = '';
  public selectedLabelValue: any = '';

  constructor(private route: ActivatedRoute) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showDropDownSelected = this.defaultValue ? this.defaultValue : (this.dropDownValues.length > 0 ? this.dropDownValues[0] : '')
    this.selectedLabelValue = this.defaultValue ? this.defaultValue : (this.dropDownValuesWithLabels.length > 0 ? this.dropDownValuesWithLabels[0] : '')
  }

  openDropDown() {
    this.isDropDownOpenedCounter += 1;
    if (this.isDropDownOpenedCounter % 2 === 0) {
      this.isDropDownOpened = true;
    } else {
      this.isDropDownOpened = false;
    }
  }

  selectValue(value: any, i: any) {
    this.switcherEmit.emit({value, i})
    this.isDropDownOpenedCounter +=1;
    if (this.dropDownValuesWithLabels.length) {
      this.selectedLabelValue = this.dropDownValuesWithLabels.find(item => item.id === value);
    } else {
      this.showDropDownSelected = value;
    }
    this.isDropDownOpened = false;
    this.dropDownValue.emit(value);
  }

  returnAddress(acc: any) {
    let finalAcc;
    if (localStorage.getItem('wallet')) {
      acc = localStorage.getItem('wallet')!;
      finalAcc = acc;
    }
    let start: string = '';
    let last: string = ''
    start = finalAcc.substring(0,3);
    last = finalAcc.substring(acc.length, acc.length - 3);
    let final = start + '...' + last;
    return final
  }
}
