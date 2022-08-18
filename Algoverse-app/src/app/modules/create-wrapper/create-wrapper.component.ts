import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-create-wrapper',
  templateUrl: './create-wrapper.component.html',
  styleUrls: ['./create-wrapper.component.scss']
})
export class CreateWrapperComponent implements OnInit {

  constructor(private readonly location: Location) { }

  ngOnInit(): void {
  }

  public onBack(): void {
    this.location.back();
  }
}
