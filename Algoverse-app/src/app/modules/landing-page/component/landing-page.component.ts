import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public hotDropDown = ['Collections', 'Item', 'Buyers', 'Sellers', 'Creators'];
  public hotInDropDown = ['1 Day', '7 Days', '30 Days', 'All Time',];

  constructor() { }

  ngOnInit(): void {
  }

}
