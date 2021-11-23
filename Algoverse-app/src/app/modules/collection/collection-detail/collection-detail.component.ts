import { Component, OnInit } from '@angular/core';
import {CollectionModelInfo} from "../../../models/collection.model";
import {CollectionService} from "../../../services/collection.service";

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {
  public arr = [12,3,,4,4,5,5,5,5,5,6,,6,77]
  collectionInfo:CollectionModelInfo =
    {
      "collectionId": "08d9827d-bbb9-4063-8447-58813eb0df7c",
      "name": "AV Minted V2",
      "icon": "rndipfs.com/link-to-collection",
      "banner": "anotheripfs.com/link-to-banner",
      "featuredImage": "with awesome featured image",
      "description": "Default Collection for all NFTs minted on Algoverse, without a chosen collection.",
      "royalties": 50,
      "customURL": "algoverse.exchange/collections/AV-Minted",
      "category": "Minted by AV",
      "web": "algoverse.exchange",
      "creator": {
        "wallet": "BSOMH2YRF5DIYRLN5DEEXGV7EUIXC4BKXENJIRECRYINAPABSF37B52ZWY",
        "name": "Mr. Design 9999",
        "profileImage": "rndipfs.com/link",
        "verified": true,
        "wonVotingPeriods": [
          1
        ],
        "volume": null
      },
      "stars": 0,
      "volume": 6000.0000000000000000000000000
    }
  constructor(private _collectionService: CollectionService) { }

  ngOnInit(): void {
    console.log(this.collectionInfo);
  }

  addStar() {
    this._collectionService.addStar({
      starredCollectionID: "08d9827d-bbb9-4063-8447-58813eb0df7c",
      starringWallet: "BSOMH2YRF5DIYRLN5DEEXGV7EUIXC4BKXENJIRECRYINAPABSF37B52ZWY"
    }).subscribe( (s) => console.log(s));
  }

  // removeStart() {
  //   this._collectionService.removeStar({
  //     collectionStarId: "08d9827d-bbb9-4063-8447-58813eb0df7c",
  //   }).subscribe( (s) => console.log(s));
  // }



}
