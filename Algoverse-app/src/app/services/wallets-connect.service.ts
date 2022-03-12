import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import algosdk, { Algodv2, Indexer, IntDecoding, BaseHTTPClient, getApplicationAddress } from 'algosdk';
import AccountInformation from 'algosdk/dist/types/src/client/v2/algod/accountInformation';
import GetAssetByID from 'algosdk/dist/types/src/client/v2/algod/getAssetByID';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { getAlgodClient, getTransactionParams, singlePayTxn, waitForTransaction } from './utils.algod';
import MyAlgoConnect from '@randlabs/myalgo-connect';

const client = getAlgodClient()
const myAlgoConnect = new MyAlgoConnect();

@Injectable()
export class WalletsConnectService {

  public myAlgoAddress: any | undefined;
  public myAlgoName: any | undefined;

  constructor(private userServce: UserService) { }

  // connectToWalletConnect = () => {
  //   try {
  //     // Create a connector
  //     const connector = new WalletConnect({
  //       bridge: "https://bridge.walletconnect.org", // Required
  //       qrcodeModal: QRCodeModal,
  //     });

  //     // Check if connection is already established
  //     if (!connector.connected) {
  //       // create new session
  //       connector.createSession();
  //     }

  //     // Subscribe to connection events
  //     connector.on("connect", (error, payload) => {
  //       if (error) {
  //         throw error;
  //       }

  //       // Get provided accounts
  //       const { accounts } = payload.params[0];
  //       console.log(accounts);
  //     });

  //     connector.on("session_update", (error, payload) => {
  //       if (error) {
  //         throw error;
  //       }

  //       // Get updated accounts
  //       const { accounts } = payload.params[0];
  //       console.log(accounts);
  //     });

  //     connector.on("disconnect", (error, payload) => {
  //       if (error) {
  //         throw error;
  //       }


  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  connectToMyAlgo = async () => {
    try {
      const accounts = await myAlgoConnect.connect();

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
        setTimeout(() => {

        }, 1000)
      }

    } catch (err) {
      console.error(err);
    }
  }

  getOwnAssets = async () => {
    let result = [];

    try {
      const algod = getAlgodClient();
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
      }

    } catch (err) {
      console.error(err);
    }

    return result;
  }

  payTradeIndex = async (tradeIndex: string, amount: number): Promise<any> => {
    try {
      const txn = await singlePayTxn(this.myAlgoAddress[0], tradeIndex, amount, "Payment for trade setup to opt app into asset");
      await myAlgoConnect.signTransaction(txn);
      const result = await client.sendRawTransaction(txn.blob).do();
      await waitForTransaction(client, result.txId);

      return result.txId;

    } catch (err) {
      console.error(err);
    }

    return false;
  }

  createTrade = async (params: any): Promise<number> => {
    try {
      const suggestedParams = await getTransactionParams();
      let txns = [];

      const tokenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: this.myAlgoAddress[0],
        to: getApplicationAddress(environment.TRADE_APP_ID),
        amount: params.amount,
        assetIndex: params.assetID,
        note: new Uint8Array(Buffer.from("Amount to place trade")),
        suggestedParams,
      });
      txns.push(tokenTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.myAlgoAddress[0],
        appIndex: environment.TRADE_APP_ID,
        note: new Uint8Array(Buffer.from("Place trade")),
        appArgs: [new Uint8Array(Buffer.from("trade")), algosdk.encodeUint64(params.price)],
        accounts: [params.tradeIndex],
        suggestedParams,
      });
      txns.push(appCallTxn);

      const txnGroup = algosdk.assignGroupID(txns);
      const signedTxns = await myAlgoConnect.signTransaction(txns.map(txn => txn.toByte()));

      const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
      console.log("Transaction : " + results[1].txId);
      await waitForTransaction(client, results[1].txId);

      return results[1].txId;

    } catch (err) {
      console.error(err);
    }

    return 0;
  }

  createSwap = async (params: any) => {
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

  createAuction = async (params: any) => {
    let result = [];

    try {
      const algod = getAlgodClient();
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
