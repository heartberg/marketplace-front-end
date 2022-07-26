import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.scss']
})
export class CollectionDetailComponent implements OnInit {

  public mCollection: any = {};
  public mAssets: any = [];

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _stateService: StateService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const collectionIdFromRoute = routeParams.get('collectionId');
    if (!collectionIdFromRoute) {
      this.router.navigateByUrl('collection');
      return;
    }

    this._userService.loadCollectionItem(collectionIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mCollection = res;
        this.mAssets = this.mCollection.assets;
        this._stateService.passingData = this.mCollection;
        this.showCollectionDetails();
      },
      error => console.log(error)
    )
  }

  showCollectionDetails() {

  }


}
