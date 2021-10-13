import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-collection',
  templateUrl: './my-collection.component.html',
  styleUrls: ['./my-collection.component.scss']
})
export class MyCollectionComponent implements OnInit {
  public arr = [1,2,3,4,5,3,3,3,,4,234,32,423,4,23,4,]
  constructor() { }

  ngOnInit(): void {
  }

}
