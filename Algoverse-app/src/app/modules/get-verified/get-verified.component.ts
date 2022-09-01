import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-get-verified',
  templateUrl: './get-verified.component.html',
  styleUrls: ['./get-verified.component.scss']
})
export class GetVerifiedComponent implements OnInit {

  constructor(private readonly _location: Location) { }

  ngOnInit(): void {
  }

  public actionBack(): void {
    this._location.back();
  }
}
