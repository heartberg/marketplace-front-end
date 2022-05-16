import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WalletsConnectService } from '../services/wallets-connect.service';

@Component({
  selector: 'app-swap-detail',
  templateUrl: './swap-detail.component.html',
  styleUrls: ['./swap-detail.component.scss']
})
export class SwapDetailComponent implements OnInit {

  private mSwap: any = null;
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
    const SwapIdFromRoute = routeParams.get('swapId');
    if (!SwapIdFromRoute) {
      this.router.navigateByUrl('items');
      return;
    }

    this._userService.loadSwapItem(SwapIdFromRoute).subscribe(
      res => {
        console.log('res', res);
        this.mSwap = res;
        this.selectedAssetID = this.mSwap.assetId;
        const asset = this.mSwap.asset;
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

  async cancelSwap() {
    const swapIndex = this.mSwap.indexAddress;
    console.log('start cancel Bid');
    const result = await this._walletsConnectService.cancelBid(swapIndex);
    if (result) {
      const result1 = this._userService.cancelBid(swapIndex);
      if (result1) {
        console.log('Successfully cancelled')
      }
    }
  }

}
