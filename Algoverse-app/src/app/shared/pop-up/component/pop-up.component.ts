import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {UserService} from 'src/app/services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AllowedWalletsEnum} from "../../../models";
import { Router } from '@angular/router';

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
  @Input() selected = false;
  @Input() asset: any;
  @Input() decimals: any;
  @Input() followers: any;
  @Input() followed: any;
  @Input() showFollower = false;
  @Input() showFollowed = false;

  ownFollowings: any;
  walletsForSwitching: any = '';
  enteredOffer: any;
  enteredAmount: any;
  public allowedWallets: typeof AllowedWalletsEnum = AllowedWalletsEnum;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  closePopUp(value: any) {
    this.isClosed.emit(false);
  }

  async selectedWalletConnect(choice: AllowedWalletsEnum) {
    switch (choice) {
      case AllowedWalletsEnum.MY_ALGO_CONNECT: {
        await this._walletsConnectService.connect('my-algo-connect');
        if (this._walletsConnectService.myAlgoAddress && this._walletsConnectService.myAlgoName !== undefined) {
          this.isConnectedToWallet.emit(true);
          console.log('Connected to MyAlgoWallet');
        }
        break;
      }
      case AllowedWalletsEnum.WALLET_CONNECT: {
        await this._walletsConnectService.connect('wallet-connect');
        if (this._walletsConnectService.myAlgoAddress) {
          this.isConnectedToWallet.emit(true);
          console.log('Connected to Pera Wallet')
        }
        break;
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

    const sessionWallet = JSON.parse(localStorage.getItem('sessionWallet')!);

    switch (sessionWallet.wname) {
      case 'my-algo-connect': {
        this.selectedWalletConnect(AllowedWalletsEnum.MY_ALGO_CONNECT);
        break;
      }

      case 'wallet-connect': {
        this.selectedWalletConnect(AllowedWalletsEnum.WALLET_CONNECT);
        break;
      }
    }

    this.isSwitched.emit(false);
  }

  getValueFromDropDown($event: any) {
    let index = +$event.i - 1;
    this.switchAcc(+index);
    console.log($event)
  }

  cancel() {
    this.isClosed.emit(false);
  }

  openProfile(wallet: string) {
    this.closePopUp(true);
    let url = "profile/" + wallet
    this.router.navigateByUrl(url)
  }

  blurOfferEvent(event: any) {
    this.enteredOffer = event.target.value * Math.pow(10, 6);
    console.log(this.enteredOffer);
  }

  blurAmount(event: any) {
    this.enteredAmount = event.target.value * Math.pow(10, this.decimals);
    console.log(this.enteredAmount);
  }

  async sendCreateBidRequest(indexAddress: string) {
    this.spinner.show()
    const params1 = {
      assetID: this.asset.assetId,
      amount: this.enteredAmount,
      price: this.enteredOffer,
      bidIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createBid(params1);
    console.log('txID', txID);

    if (txID) {
      const asset = this.asset;
      if (txID && asset) {
        const params2 = {
          bidId: txID,
          bidderAddress: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
          assetId: this.asset.assetId,
          indexAddress,
          price: this.enteredOffer,
          amount: this.enteredAmount
        }
        console.log('create bid param', params2)
        this._userService.createBid(params2).subscribe(
          res => {
            this.spinner.hide();
            alert('Successfully created');
            console.log(res);
          },
          error => {
            this.spinner.hide();
            alert(error);
            console.log('Network error, please try again later');
          }
        );
      }
    } else {
      this.spinner.hide();
      alert("Failed creating bid on algorand network");
    }
  }

  placeBid() {
    if(!this.enteredOffer) {
      alert("Please enter offered amount!");
      return;
    }

    if(!this.enteredAmount) {
      alert("Please enter amount!");
      return;
    }

    this._userService.getBidIndex(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
      async (res) => {
        console.log('bidIndex', res);
        const indexAddress = res.indexAddress;
        let result = await this._walletsConnectService.setupBid(indexAddress, Number(this.asset!.assetId), res.optinPrice);
        if (result) {
          console.log(this.asset!.assetId)
          this._userService.optinAndRekeyToBid(indexAddress).subscribe(
            async (res) => {
              console.log('setup bid response: ', res);
              if (res) {
                await this.sendCreateBidRequest(indexAddress);
                this.closePopUp(true)
              } else {
                alert('optin and rekey failed');
              }
            },
            (err) => {
              this.spinner.hide();
              alert('setup bid error: ' + err);
            }
          )
        } else {
          this.spinner.hide();
          if (result === 0) {
            alert("Insufficient balance");
          } else {
            alert("Exception occurred, please retry again later");
          }
        }
      },
      (error) => {
        this.spinner.hide();
        console.log('algo net create bid error', error)
        alert('Network error, please try again later')
      }
    );
  }
}
