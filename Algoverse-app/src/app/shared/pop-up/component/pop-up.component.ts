import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WalletsConnectService } from "../../../services/wallets-connect.service";
import { of } from "rxjs";
import { Store } from '@ngrx/store';
import { Login } from 'src/app/core/actions/auth.actions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  @Output() isConnectedToWallet = new EventEmitter<boolean>();
  @Output() isClosed = new EventEmitter<boolean>();

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private authService: AuthService,
    private store: Store
  ) { }

  ngOnInit(): void {
  }

  closePopUp(value: any) {
    this.isClosed.emit(false);
  }

  async setelectWalletConnect(value: string) {
    if (value === 'MyAlgoWallet') {
      let wallet = localStorage.getItem('wallet');
      await of(this._walletsConnectService.connectToMyAlgo()).toPromise();
      if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
        this.authService.getUserByWallet(
          // @ts-ignore
          'BSOMH2YRF5DIYRLN5DEEXGV7EUIXC4BKXENJIRECRYINAPABSF37B52ZWY'
        ).subscribe(
          (user: User) => {
            this.store.dispatch(new Login({
              user: user
            }))
          }
        )
        this.isConnectedToWallet.emit(false);
        console.log('Connected to MyAlgoWallet')
      }
    }
  }

}
