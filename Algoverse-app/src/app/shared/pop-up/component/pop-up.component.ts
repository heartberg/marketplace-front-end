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
  ) { }

  ngOnInit(): void {
  }

  closePopUp(value: any) {
    this.isClosed.emit(false);
  }

  async setelectWalletConnect(value: string) {
    if (value === 'MyAlgoWallet') {
      await this._walletsConnectService.connect('my-algo-connect');
      if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
        this.isConnectedToWallet.emit(false);
        console.log('emited')
        console.log('Connected to MyAlgoWallet')
      }
    } else if (value == 'WalletConnect') {
      await this._walletsConnectService.connect('wallet-connect');
      if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
        this.isConnectedToWallet.emit(false);
        console.log('Connected to MyAlgoWallet')
      }
    } else if (value == 'AlgoSigner') {
      await this._walletsConnectService.connect('algo-signer');
      if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
        this.isConnectedToWallet.emit(false);
        console.log('Connected to MyAlgoWallet')
      }
    }
  }
}
