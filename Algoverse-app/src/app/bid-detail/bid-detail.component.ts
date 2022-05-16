import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';

@Component({
  selector: 'app-bid-detail',
  templateUrl: './bid-detail.component.html',
  styleUrls: ['./bid-detail.component.scss']
})
export class BidDetailComponent implements OnInit {

  private mBid: any = null;
  private selectedAssetID = 0;
  private assets: any[] = [];
  public assetIDs: string[] = [];
  public maxSupply = 1;
  public selectedAssetDescription = "";
  public metaDataProperties: any = {};

  public royalty: string = "0";
  public amount: string = "0";
  public price: string = "0";

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const routeParams = this.route.snapshot.paramMap;
    const BidIdFromRoute = routeParams.get('bidId');
    if (!BidIdFromRoute) {
      this.router.navigateByUrl('items');
      return;
    }

    this._userService.loadBidItem(BidIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mBid = res;
        this.selectedAssetID = this.mBid.assetId;
        const asset = this.mBid.asset;
        this.showAssetDetails(asset);
      },
      error => console.log(error)
    )
  }

  showAssetDetails(asset: any) {
    console.log('masset', asset);
    this.selectedAssetID = asset.assetId;
    this.selectedAssetDescription = `Name: ${asset.params.name} \nUnitName: ${asset.params['unit-name']}`;
    this.maxSupply = asset.supply;

    this.metaDataProperties = asset.properties;
  }

  blurRoyaltyEvent(event: any){
    this.royalty = event.target.value;
    console.log(this.royalty);
  }

  blurAmountEvent(event: any){
    this.amount = event.target.value;
    console.log(this.amount);``
  }

  blurPriceEvent(event: any){
    this.price = event.target.value;
    console.log(this.price);
  }

  async cancelBid() {
    const bidIndex = this.mBid.indexAddress;
    console.log('start cancel Bid');
    const result = await this._walletsConnectService.cancelBid(bidIndex);
    if (result) {
      const result1 = this._userService.cancelBid(bidIndex);
      if (result1) {
        console.log('Successfully cancelled')
      }
    }
  }

}
