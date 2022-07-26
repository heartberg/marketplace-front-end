import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {UserService} from 'src/app/services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AllowedWalletsEnum} from "../../../models";
import { Router } from '@angular/router';
import GetAssetByID from 'algosdk/dist/types/src/client/v2/algod/getAssetByID';
import algosdk from 'algosdk';
import { getAlgodClient } from 'src/app/services/utils.algod';
import {WhitelistService} from "../../../services/whitelist.service";
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  @Output() isConnectedToWallet = new EventEmitter<boolean>();
  @Output() isClosed = new EventEmitter<boolean>();
  @Output() isSwitched = new EventEmitter<boolean>();
  @Input() switcher = false;
  @Input() selected = false;
  @Input() asset: any;
  @Input() assetInfo: any;
  @Input() followers: any;
  @Input() followed: any;
  @Input() showFollower = false;
  @Input() showFollowed = false;
  @Input() trade = false;
  @Input() balance = 0;

  ownFollowings: any;
  walletsForSwitching: any = '';
  enteredOffer: any;
  enteredAmount: number = 1;
  totalSupply: number = 0;
  decimals: number = 0;
  public allowedWallets: typeof AllowedWalletsEnum = AllowedWalletsEnum;
  public isDark: boolean = false;

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private readonly _whitelistService: WhitelistService,
    private readonly _themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    if(this.selected) {
      this.totalSupply = this.assetInfo.params.total
      this.decimals = this.assetInfo.params.decimals
    }
    this.subscribeToThemeColor();
  }

  scaleTotalSupply(supply: number){
    return supply / Math.pow(10, this.decimals)
  }

  closePopUp(value: any) {
    console.log(this.followed)
    this.isClosed.emit(false);
  }

  async selectedWalletConnect(choice: AllowedWalletsEnum) {
    switch (choice) {
      case AllowedWalletsEnum.MY_ALGO_CONNECT: {
        this._whitelistService.isWhitelistedValue = false;
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
    let url = "profile/" + wallet;
    this.router.navigate([url]);
    //this.router.navigateByUrl()
  }

  blurOfferEvent(event: any) {
    this.enteredOffer = event.target.value * Math.pow(10, 6);
    console.log(this.enteredOffer);
  }

  blurAmount(event: any) {
    this.enteredAmount = event.target.value * Math.pow(10, this.assetInfo.params.decimals);
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
        this._userService.createBid(params2).pipe().subscribe(
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
      alert("Please enter offered Algo amount!");
      return;
    }

    if((this.assetInfo.params.decimals > 0 || this.assetInfo.params.total > 1 ) && !this.enteredAmount) {
      alert("Please enter asset amount!");
      return;
    }

    if(this.enteredAmount > this.totalSupply) {
      alert("Entered asset amount higher than supply!");
      return;
    }

    if(this.enteredAmount * Math.pow(10, this.decimals) < 1) {
      alert("Too many decimals on asset amount!");
    }

    console.log('start bid');
    this.spinner.show();
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
                alert("setup bid!")
                this.spinner.hide();
                this.closePopUp(true);
                window.location.reload();
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

  async sendCreateTradeRequest(indexAddress: string) {
    const params1 = {
      assetID: this.asset.assetId,
      amount: this.enteredAmount,
      price: this.enteredOffer,
      tradeIndex: indexAddress
    }
    const txID = await this._walletsConnectService.createTrade(params1);

    if (txID) {
      const params2 = {
        tradeId: txID,
        assetId: this.asset.assetId,
        indexAddress,
        price: this.enteredOffer,
        creatorWallet: this._walletsConnectService.sessionWallet!.getDefaultAccount(),
        amount: this.enteredAmount
      }
      console.log('params2', params2);
      this._userService.createTrade(params2).subscribe(
        res => {
          this.spinner.hide();
          alert("Created trade successfully");
          console.log(res)
        },
        error => {
          this.spinner.hide();
          alert(error);
          console.log(error)
        }
      );
    } else {
      this.spinner.hide();
      alert("Failed creating trade on algorand network");
    }
  }

  createSale() {
    if(!this.enteredOffer) {
      alert("Please enter offered Algo amount!");
      return;
    }

    if((this.assetInfo.params.decimals > 0 || this.assetInfo.params.total > 1) && !this.enteredAmount) {
      alert("Please enter amount!");
      return;
    }

    if(this.enteredAmount > this.balance) {
      alert("Entered asset amount exceeds wallet balance!");
      return;
    }

    if(this.enteredAmount * Math.pow(10, this.decimals) < 1) {
      alert("Too many decimals on asset amount!");
      return;
    }

    console.log('start bid');
    this.spinner.show();
    this._userService.getTradeIndex(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
      async (res) => {
        console.log('tradeIndex', res);
        const indexAddress = res.indexAddress;
        let result = await this._walletsConnectService.setupTrade(indexAddress, Number(this.asset!.assetId), res.optinPrice);
        if (result) {
          this._userService.optinAndRekeyToTrade(indexAddress).subscribe(
            async (res) => {
              console.log('setup sale response: ', res);
              if (res) {
                await this.sendCreateTradeRequest(indexAddress);
                alert("setup sale!")
                this.spinner.hide()
                this.closePopUp(true);
                window.location.reload();
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

  formatFractions(decimals: number) {
    if(decimals < 5) {
      return Math.pow(10, decimals).toFixed(0)
    } else {
      return decimals
    }
  }

  private subscribeToThemeColor(): void {
    this._themeService.$colorTheme.subscribe((theme: string) => {
      theme === "dark" ? this.isDark = true : this.isDark = false;
    })
  }

}
