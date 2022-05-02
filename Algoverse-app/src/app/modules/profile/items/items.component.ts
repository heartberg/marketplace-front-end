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
  public arr = [1,2,3,4,5,3,3,3,4,234,32,423,4,23,4,]
  public types: string[] = ['Trade', 'Bid', 'Swap', 'Auction'];

  constructor(
    private router: Router,
    private _userService: UserService,
    private _walletsConnectService: WalletsConnectService
  ) {}

  ngOnInit(): void {
    if (!this._walletsConnectService.sessionWallet?.getDefaultAccount()) {
      return;
    }

    this._userService.loadTrades().subscribe(
      res => {
        console.log('Successfully created')
        console.log(res)
      },
      error => console.log(error)
    );
  }

  onSelectedType(type: string) {

  }

}
