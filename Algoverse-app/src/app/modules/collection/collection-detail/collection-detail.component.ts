import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {
  public arr = [12,3,,4,4,5,5,5,5,5,6,,6,77]
  constructor() { }

  ngOnInit(): void {
  }

}
