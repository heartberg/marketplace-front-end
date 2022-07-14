import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Input() switcher = false;
  @Output() isSwitched = new EventEmitter<boolean>();
  walletsForSwitching: any = '';
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
        console.log('Connected to WalletConnect')
      }
    } else if (value == 'AlgoSigner') {
      await this._walletsConnectService.connect('algo-signer');
      if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
        this.isConnectedToWallet.emit(false);
        console.log('Connected to AlgoSigner')
      }
    }
  }

  wallet() {
    this.walletsForSwitching = JSON.parse(localStorage.getItem('walletsOfUser')!);
    return this.walletsForSwitching;
  }

  switchAcc(i: number) {
    localStorage.removeItem('wallet');
    localStorage.setItem('walletIndex', JSON.stringify(i));
    this.setelectWalletConnect('MyAlgoWallet');
    this.isSwitched.emit(false)
  }

  getValueFromDropDown($event: any) {
    let index = +$event.i - 1;
    this.switchAcc(+index);
    console.log($event)
  }
}
