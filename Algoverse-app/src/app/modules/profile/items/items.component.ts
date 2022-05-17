import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  public arr = []
  public types: string[] = ['Trade', 'Bid', 'Swap', 'Auction'];

  constructor(
    private router: Router,
    private _userService: UserService,
    private _walletsConnectService: WalletsConnectService
  ) {}

  ngOnInit(): void {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    if (!this._walletsConnectService.sessionWallet?.getDefaultAccount()) {
      return;
    }

    this._userService.loadTrades(this._walletsConnectService.sessionWallet.getDefaultAccount()).subscribe(
      res => {
        console.log(res)
        this.arr = res
      },
      error => console.log(error)
    );
  }

  onSelectedType(type: string) {
    if (type == 'Trade') {
      this._userService.loadTrades(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        res => {
          console.log(res)
          this.arr = res
        },
        error => console.log(error)
      );
    } else if (type == 'Bid') {
      this._userService.loadBids(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        res => {
          console.log(res)
          this.arr = res
        },
        error => console.log(error)
      );
    } else if (type == 'Swap') {
      this._userService.loadSwaps(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        res => {
          console.log(res)
          this.arr = res
        },
        error => console.log(error)
      );
    } else if (type == 'Auction') {
      this._userService.loadAuctions(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
        res => {
          console.log(res)
          this.arr = res
        },
        error => console.log(error)
      );
    }
  }

  getLink(item: any) {
    console.log('item', item);
    return `/trade-detail/${item.tradeId}`
  }

}
