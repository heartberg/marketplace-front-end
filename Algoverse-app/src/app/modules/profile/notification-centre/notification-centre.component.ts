import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';

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
    private _userService: UserService
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

  getType(type: number) {
    if(type == 1) {
      return "Bid"
    } else {
      return "some other Type"
    }
  }

}
