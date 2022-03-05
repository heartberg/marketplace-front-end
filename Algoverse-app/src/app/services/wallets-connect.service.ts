import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { MyAlgoWallet } from '@randlabs/wallet-myalgo-js';
import { Algodv2, Indexer, IntDecoding, BaseHTTPClient } from 'algosdk';
import AccountInformation from 'algosdk/dist/types/src/client/v2/algod/accountInformation';
import GetAssetByID from 'algosdk/dist/types/src/client/v2/algod/getAssetByID';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

const myAlgoWallet = new MyAlgoWallet();

@Injectable()
export class WalletsConnectService {

  public myAlgoAddress: any | undefined;
  public myAlgoName: any | undefined;

  constructor(private userServce: UserService) {}

  connectToMyAlgo = async() => {
    try {
      const accounts = await myAlgoWallet.connect();
      console.log('accounts', accounts);
      this.myAlgoAddress = accounts.map(value => value.address)
      console.log('addresses', this.myAlgoAddress);
      // @ts-ignore
      this.myAlgoName = accounts.map(value => value.name)

      if (this.myAlgoAddress.length > 0) {
        this.userServce.loadProfile(this.myAlgoAddress[0]).subscribe(
          (result) => console.log('profile', result),
          (error) => console.log('error', error)
        );
        setTimeout( () => {

        }, 1000)
      }

    } catch (err) {
      console.error(err);
    }
  }

  getOwnAssets = async() => {
    let result = [];

    try {
      const tokenHeader = {
        "X-Algo-API-Token": environment.ALGOD_TOKEN
      };

      const algod = new Algodv2(tokenHeader, environment.ALGOD_URL, 4001);
      const algodIndexer = new Indexer(environment.ALGOD_TOKEN, environment.ALGOD_INDEXER_ADDRESS, 8980);

      if (Array.isArray(this.myAlgoAddress) && this.myAlgoAddress.length > 0) {
        const accountInfo = await algod.accountInformation(this.myAlgoAddress[0]).do();
        console.log('accountInfo', accountInfo);

        if (accountInfo.assets && Array.isArray(accountInfo.assets)) {
          for (let assetInfo of accountInfo.assets) {
            const asset = await algod.getAssetByID(assetInfo['asset-id']).do();
            console.log('asset-id:' + assetInfo['asset-id'], asset);
            result.push(asset);
          }
        }

        // const accountInfo = algodIndexer.lookupAccountByID(this.myAlgoAddress[0]);
        // console.log('accountInfo', accountInfo);
        // const accounts = await algodIndexer.searchAccounts().do();
        // console.log('accounts', accounts);
        // const assets = await algodIndexer.searchForAssets().do();
        // console.log('assets', assets);
      }

    } catch (err) {
      console.error(err);
    }

    return result;
  }
}
