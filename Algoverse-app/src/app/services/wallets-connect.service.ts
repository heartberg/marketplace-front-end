import { Injectable } from '@angular/core';
import { MyAlgoWallet } from '@randlabs/wallet-myalgo-js';

const myAlgoWallet = new MyAlgoWallet();

@Injectable()

export class WalletsConnectService {
  public myAlgoAddress: any | undefined;
  public myAlgoName: any | undefined;

   connectToMyAlgo = async() => {
    try {
      const accounts = await myAlgoWallet.connect();
      this.myAlgoAddress = accounts.map(value => value.address)
      // @ts-ignore
      this.myAlgoName = accounts.map(value => value.name)

    } catch (err) {
      console.error(err);
    }
  }

}
