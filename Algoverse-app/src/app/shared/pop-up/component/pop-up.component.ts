import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {of} from "rxjs";

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
    private _walletConnectConnector: WalletsConnectService,
  ) { }

  ngOnInit(): void {
  }

  closePopUp(value: any) {
    this.isClosed.emit(false);
  }

  async setelectWalletConnect(value: string) {
    if (value === 'MyAlgoWallet') {
      await of(this._walletsConnectService.connectToMyAlgo()).toPromise();
      if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
        this.isConnectedToWallet.emit(false);
        console.log('Connected to MyAlgoWallet')
      }
    }


  }
}
