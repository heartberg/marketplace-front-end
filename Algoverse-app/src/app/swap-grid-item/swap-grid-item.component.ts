import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-swap-grid-item',
  templateUrl: './swap-grid-item.component.html',
  styleUrls: ['./swap-grid-item.component.scss']
})
export class SwapGridItemComponent implements OnInit {

  @Input() mItem: any = {};
  isCollection: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
