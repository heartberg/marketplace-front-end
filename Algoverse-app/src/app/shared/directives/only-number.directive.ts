import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({selector: '[onlyNumbers]'})

export class OnlyNumbers {

  @Input() private allowDecimals: boolean = true;
  @Input() private allowSign: boolean = false;
  @Input() private decimalSeparator: string = '.';

  private previousValue: string = '';

  private integerUnsigned: string = '^[0-9]*$';
  private integerSigned: string = '^-?[0-9]+$';
  private decimalUnsigned: string = '^[0-9]+(.[0-9]+)?$';
  private decimalSigned: string = '^-?[0-9]+(.[0-9]+)?$';

  constructor(private hostElement: ElementRef) {
  }

  @HostListener('change', ['$event']) onChange(e: any) {
    this.validateValue(this.hostElement.nativeElement.value);
  }

  @HostListener('paste', ['$event']) onPaste(e: any) {
    let value = e.clipboardData.getData('text/plain');
    this.validateValue(value);
    e.preventDefault();
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    let cursorPosition: number = e.target['selectionStart'];
    let originalValue: string = e.target['value'];
    let key: string = this.getName(e);
    let controlOrCommand = (e.ctrlKey === true || e.metaKey === true);
    let signExists = originalValue.includes('-');
    let separatorExists = originalValue.includes(this.decimalSeparator);

    let allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'
    ];

    let separatorIsCloseToSign = (signExists && cursorPosition <= 1);
    if (this.allowDecimals && !separatorIsCloseToSign && !separatorExists) {
      if (this.decimalSeparator == '.')
        allowedKeys.push('.');
      else
        allowedKeys.push(',');
    }

    let firstCharacterIsSeparator = (originalValue.charAt(0) != this.decimalSeparator);
    if (this.allowSign && !signExists &&
      firstCharacterIsSeparator && cursorPosition == 0) {
      allowedKeys.push('-');
    }

    if (allowedKeys.indexOf(key) != -1 ||
      (key == 'a' && controlOrCommand) ||
      (key == 'c' && controlOrCommand) ||
      (key == 'v' && controlOrCommand) ||
      (key == 'x' && controlOrCommand)) {
      return;
    }

    this.previousValue = originalValue;

    let isNumber = (new RegExp(this.integerUnsigned)).test(key);
    if (isNumber) return; else e.preventDefault();
  }

  public validateValue(value: string): void {
    let regex: string = '';
    if (!this.allowDecimals && !this.allowSign) regex = this.integerUnsigned;
    if (!this.allowDecimals && this.allowSign) regex = this.integerSigned;
    if (this.allowDecimals && !this.allowSign) regex = this.decimalUnsigned;
    if (this.allowDecimals && this.allowSign) regex = this.decimalSigned;

    let firstCharacter = value.charAt(0);
    if (firstCharacter == this.decimalSeparator)
      value = 0 + value;

    let lastCharacter = value.charAt(value.length - 1);
    if (lastCharacter == this.decimalSeparator)
      value = value + 0;

    let valid: boolean = (new RegExp(regex)).test(value);
    this.hostElement.nativeElement['value'] = valid ? value : 0;
  }

  public getName(e: any) {
    if (e.key) {
      return e.key;
    } else {
      if (e.keyCode && String.fromCharCode) {
        switch (e.keyCode) {
          case   8:
            return 'Backspace';
          case   9:
            return 'Tab';
          case  27:
            return 'Escape';
          case  37:
            return 'ArrowLeft';
          case  39:
            return 'ArrowRight';
          case 188:
            return ',';
          case 190:
            return '.';
          case 109:
            return '-';
          case 173:
            return '-';
          case 189:
            return '-';
          default:
            return String.fromCharCode(e.keyCode);
        }
      }
    }
  }
}
