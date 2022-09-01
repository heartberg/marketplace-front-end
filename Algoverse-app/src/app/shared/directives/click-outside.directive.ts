import {Directive, Output, EventEmitter, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  @Input() excludeSelector: string = '';
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const isExcluded = target.classList.contains(this.excludeSelector);
    const clickedInside = (this.elementRef.nativeElement as HTMLElement).contains(target);
    if (!clickedInside && !isExcluded) {
      this.clickOutside.emit();
    }
  }
}
