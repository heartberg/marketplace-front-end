import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {CollectionAllMarkeplaceObj} from "../../models/collection-hot.model";

@Component({
  selector: 'app-collection-card',
  templateUrl: './timed-auction-card.component.html',
  styleUrls: ['./timed-auction-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  @Input() collection: CollectionAllMarkeplaceObj | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
