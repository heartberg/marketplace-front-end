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
  public isStarred: boolean = false;
  public collectionStar: any;
  public collectionId: string = "";

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
    this.loadCollectionDetails(collectionIdFromRoute)

  }

  loadCollectionDetails(collectionIdFromRoute: string) {
    this.collectionId = collectionIdFromRoute
    this._userService.loadCollectionItem(collectionIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mCollection = res;
        this.mAssets = this.mCollection.assets;
        this._stateService.passingData = this.mCollection;
        this.showCollectionDetails();

        if(this._walletsConnectService.sessionWallet) {
          this._userService.getCollectionStar(this._walletsConnectService.sessionWallet.getDefaultAccount(), this.mCollection.collectionId).subscribe(
            (value:any) => {
              if(value){
                this.collectionStar = value;
                this.isStarred = true;
                console.log("starred already", this.collectionStar)
              } else {
                console.log("no value")
                this.isStarred = false;
                this.collectionStar = undefined;
              }
            }, error => {
              console.log("not starred")
              this.isStarred = false;
              this.collectionStar = undefined;
            }
          )
        } else {
          this.isStarred = false;
          this.collectionStar = undefined;
        }

      },
      error => console.log(error)
    )
  }

  showCollectionDetails() {

  }

  addStar() {
    let wallet = this._walletsConnectService.sessionWallet
    if(wallet) {
      const params = {
        starredCollectionId: this.mCollection.collectionId,
        starringWallet: wallet.getDefaultAccount()
      }
      this._userService.addCollectionStar(params).subscribe(
        (value: any) => {
          console.log(value)
          this.isStarred = true;
          console.log("added star")
          this.loadCollectionDetails(this.collectionId)
        }
      )
    } else {
      alert("connect wallet")
    }

  }

  removeStar() {
    let wallet = this._walletsConnectService.sessionWallet
    if(wallet) {
      console.log(this.collectionStar)
      this._userService.removeCollectionStar(this.collectionStar.collectionStarId).subscribe(
        (value: any) => {
          console.log(value)
          this.isStarred = false;
          this.collectionStar = undefined;
          console.log("removed star")
          this.loadCollectionDetails(this.collectionId)
        }
      )
    } else {
      alert("connect wallet")
    }
  }


}
