import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-notification-centre',
  templateUrl: './notification-centre.component.html',
  styleUrls: ['./notification-centre.component.scss']
})
export class NotificationCentreComponent implements OnInit {
  arr: any[] = []
  selectedType: string = 'all'
  constructor(
    private _walletConnectService: WalletsConnectService,
    private _userService: UserService,
    private _location: Location,
  ) { }

  ngOnInit(): void {
    let wallet = this._walletConnectService.sessionWallet
    if(wallet) {
      this._userService.getNotification(wallet.getDefaultAccount()).subscribe(
        (res: any) => {
          this.arr = res
          console.log(res)
        }
      )
    }
  }

  selectType(type: string) {
    this.selectedType = type
  }

  showType(type: number): boolean {
    if(this.selectedType == "sell") {
      return type == 0
    } else if(this.selectedType == "auction") {
      return [7, 8, 9, 10, 14].includes(type)
    } else if(this.selectedType == "bids") {
      return [1, 2, 3, 4].includes(type)
    } else if(this.selectedType == "req") {
      return [4, 5, 6].includes(type)
    } else if(this.selectedType == "stars") {
      return [11, 12].includes(type)
    } else if(this.selectedType == "resell") {
      return type == 13
    } else {
      return true;
    }
  }

  getType(type: number) {
    if(type == 0) {
      return "Bought"
    } else if(type == 1) {
      return "Bid"
    } else if(type == 2) {
      return "Sold to someone else"
    } else if(type == 3) {
      return "Accepted Bid"
    } else if(type == 4) {
      return "New Swap Request"
    } else if(type == 5) {
      return "Accepted Swap Request"
    } else if(type == 6) {
      return "Denied Swap Request"
    } else if(type == 7) {
      return "Auction Not Won"
    } else if(type == 8) {
      return "Auction Won"
    } else if(type == 9) {
      return "New Auction Bid"
    } else if(type == 10) {
      return "Higher Auction Bid"
    }  else if(type == 11) {
      return "Starred Item"
    }  else if(type == 12) {
      return "Starred Collection"
    } else if(type == 13) {
      return "Resell"
    } else if(type == 14) {
      return "Auction Ending"
    } else if(type == 15) {
      return "Followed"
    }else {
      return "some other Type"
    }
  }

  back() {
    this._location.back()
  }

}
