import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import algosdk, { Algodv2, Indexer, IntDecoding, BaseHTTPClient, getApplicationAddress } from 'algosdk';
import AccountInformation from 'algosdk/dist/types/src/client/v2/algod/accountInformation';
import GetAssetByID from 'algosdk/dist/types/src/client/v2/algod/getAssetByID';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { getAlgodClient, getAppLocalStateByKey, getTransactionParams, singlePayTxn, waitForTransaction } from './utils.algod';
import { Buffer } from 'buffer';
import { SessionWallet } from 'algorand-session-wallet';

const client = getAlgodClient()

@Injectable()
export class WalletsConnectService {

  public sessionWallet: SessionWallet | undefined;
  public myAlgoAddress: any | undefined;
  public myAlgoName: any | undefined;

  constructor(private userServce: UserService) { }

  connect = async (choice: string) => {
    console.log('choice', choice);
    this.sessionWallet = new SessionWallet("TestNet", undefined, choice);

    if (!await this.sessionWallet.connect()) return alert("Couldnt connect")

    this.myAlgoAddress = this.sessionWallet.accountList()
    localStorage.setItem('wallet', this.sessionWallet.getDefaultAccount())
    this.myAlgoName = this.myAlgoAddress.map((value: { name: any; }) => value.name)

    if (this.myAlgoAddress.length > 0) {
      this.userServce.loadProfile(this.myAlgoAddress[0]).subscribe(
        (result) => console.log('profile', result),
        (error) => {
          console.log('error', error)
          if (error.status == 404) {
            this.userServce.createProfile(this.myAlgoAddress[0]).subscribe(
              (result) => console.log('profile', result),
              (error) => console.log('error', error),
            );
          }
        }
      );
      setTimeout(() => {
      }, 1000)
    }
  }

  disconnect = async () => {
    this.sessionWallet!.disconnect()
    this.myAlgoAddress = []
  }

  async getAsset(assetID: number): Promise<any> {
    const client = getAlgodClient();
    const asset = await client.getAssetByID(assetID).do();
    console.log(asset);
    return asset;
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
          console.log('assets:', accountInfo.assets);
          for (let assetInfo of accountInfo.assets) {
            if (assetInfo.amount > 0) {
              const asset = await algod.getAssetByID(assetInfo['asset-id']).do();
              //console.log('asset-id:' + assetInfo['asset-id'], asset);

              result.push(asset);
            }
          }
        }
      }

    } catch (err) {
      console.error(err);
    }

    return result;
  }

  payToSetUpIndex = async (rekeyedIndex: string, amount: number): Promise<any> => {
    try {
      const txn = await singlePayTxn(this.myAlgoAddress[0], rekeyedIndex, amount, "Payment for trade setup to opt app into asset");
      console.log('txn', txn);
      const [signedTxn] = await this.sessionWallet!.signTxn([txn]);
      console.log('txId', signedTxn.txID);
      const result = await client.sendRawTransaction(signedTxn.blob).do();
      console.log('paid result', result);
      await waitForTransaction(client, result.txId);

      return result.txId;

    } catch (err) {
      console.error(err);
    }

    return false;
  }

  createTrade = async (params: any): Promise<number> => {
    try {
      console.log(params);
      const suggestedParams = await getTransactionParams();
      let txns = [];
      let tokens = [Number(params.assetID)];

      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, params.tradeIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, params.tradeIndex, "TA");
      if (indexTokenID !== 0 && indexTokenID > 0 && indexTokenAmount > 0 && indexTokenID != params.assetID) {
        tokens.push(indexTokenID);
      }

      suggestedParams.fee = 2000;
      if (tokens.length > 1) {
        suggestedParams.fee = 3000;
      }

      const tokenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: this.myAlgoAddress[0],
        to: getApplicationAddress(environment.TRADE_APP_ID),
        amount: Number(params.amount),
        assetIndex: Number(params.assetID),
        note: new Uint8Array(Buffer.from("Amount to place trade")),
        suggestedParams,
      });
      txns.push(tokenTxn);

      suggestedParams.fee = 0;
      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.myAlgoAddress[0],
        appIndex: environment.TRADE_APP_ID,
        note: new Uint8Array(Buffer.from("Place trade")),
        appArgs: [new Uint8Array([...Buffer.from("trade")]), algosdk.encodeUint64(Number(params.price))],
        accounts: [params.tradeIndex],
        foreignAssets: tokens,
        suggestedParams,
      });
      txns.push(appCallTxn);

      const txnGroup = algosdk.assignGroupID(txns);
      const signedTxns = await this.sessionWallet!.signTxn(txns);

      const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
      console.log("Transaction : " + JSON.stringify(results));
      await waitForTransaction(client, results.txId);

      return results.txId;

    } catch (err) {
      console.error(err);
    }

    return 0;
  }

  cancelTrade = async (tradeIndex: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, tradeIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, tradeIndex, "TA");

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.myAlgoAddress[0],
          appIndex: environment.TRADE_APP_ID,
          note: new Uint8Array(Buffer.from("Cancel trade")),
          appArgs: [new Uint8Array([...Buffer.from("cancel")])],
          accounts: [tradeIndex],
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        const result: any = await this.sessionWallet!.signTxn([appCallTxn])
        console.log("Cancel Transaction", JSON.stringify(result));
        await waitForTransaction(client, result.txId);

        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  createBid = async (params: any): Promise<number> => {
    try {
      console.log('params', params)
      const suggestedParams = await getTransactionParams();
      let txns = [];
      let tokens = [Number(params.assetID)];

      const client = getAlgodClient();

      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.myAlgoAddress[0],
        to: getApplicationAddress(environment.BID_APP_ID),
        amount: Number(params.price),
        note: new Uint8Array(Buffer.from("Amount to place bid")),
        suggestedParams,
      });
      txns.push(payTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.myAlgoAddress[0],
        appIndex: environment.BID_APP_ID,
        note: new Uint8Array(Buffer.from("Place bid")),
        appArgs: [new Uint8Array([...Buffer.from("bid")]), algosdk.encodeUint64(Number(params.amount))],
        accounts: [params.bidIndex],
        foreignAssets: tokens,
        suggestedParams,
      });
      // const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
      //   from: this.myAlgoAddress[0],
      //   appIndex: 563,
      //   note: new Uint8Array(Buffer.from("Place bid")),
      //   appArgs: [new Uint8Array([...Buffer.from("bid")]), algosdk.encodeUint64(1)],
      //   accounts: ["FIJ2QNMSKJJQKZGU3ZVW644HOQF425OPUZ5XIN5AWO6KWYRG2OVKG34NVQ"],
      //   foreignAssets: [12],
      //   suggestedParams,
      // });

      console.log("appCallTxn", appCallTxn)
      txns.push(appCallTxn);

      const txnGroup = algosdk.assignGroupID(txns);
      const signedTxns = await this.sessionWallet!.signTxn(txns);

      const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
      console.log("Transaction result : ", results);
      await waitForTransaction(client, results.txId);

      return results.txId;

    } catch (err) {
      console.error(err);
    }

    return 0;
  }

  cancelBid = async (bidIndex: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.BID_APP_ID, bidIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.BID_APP_ID, bidIndex, "TA");

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.BID_APP_ID,
          note: new Uint8Array(Buffer.from("Cancel bid")),
          appArgs: [new Uint8Array([...Buffer.from("cancel")])],
          accounts: [bidIndex],
          suggestedParams,
        });
        const result: any = await this.sessionWallet!.signTxn([appCallTxn])
        console.log("Cancel Transaction", JSON.stringify(result));
        await waitForTransaction(client, result.txId);

        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  createSwap = async (params: any) => {
    try {
      console.log('create swap params', params)
      const suggestedParams = await getTransactionParams();
      let txns = [];

      const tokenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: this.myAlgoAddress[0],
        to: getApplicationAddress(environment.SWAP_APP_ID),
        amount: Number(params.amount),
        assetIndex: Number(params.assetID),
        note: new Uint8Array(Buffer.from("Amount to place swap")),
        suggestedParams: { ...suggestedParams },
      });
      console.log('tokenTxn', tokenTxn)
      txns.push(tokenTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.myAlgoAddress[0],
        appIndex: environment.SWAP_APP_ID,
        note: new Uint8Array(Buffer.from("Place swap")),
        appArgs: [new Uint8Array(Buffer.from("swap")), algosdk.encodeUint64(Number(params.acceptAssetAmount))],
        accounts: [params.swapIndex],
        foreignAssets: [Number(params.assetID), Number(params.acceptAssetIndex)],
        suggestedParams: { ...suggestedParams },
      });
      console.log('appCallTxn', appCallTxn)
      txns.push(appCallTxn);

      const txnGroup = algosdk.assignGroupID(txns);
      const signedTxns = await this.sessionWallet!.signTxn(txns);
      console.log('signedTxns', signedTxns)

      const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
      console.log("Transaction : ", results);
      await waitForTransaction(client, results.txId);

      return results.txId;

    } catch (err) {
      console.error(err);
    }

    return 0;
  }

  cancelSwap = async (swapIndex: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "TA");

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.myAlgoAddress[0],
          appIndex: environment.SWAP_APP_ID,
          note: new Uint8Array(Buffer.from("Cancel swap")),
          appArgs: [new Uint8Array([...Buffer.from("cancel")])],
          accounts: [swapIndex],
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        const result: any = await this.sessionWallet!.signTxn([appCallTxn])
        console.log("Cancel Transaction", JSON.stringify(result));
        await waitForTransaction(client, result.txId);

        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  createAuctionApp = async (): Promise<any> => {
    let result = {
      appId: 0,
      paidMinimumBalance: false
    }

    try {
      const algod = getAlgodClient();
      const algodIndexer = new Indexer(environment.ALGOD_TOKEN, environment.ALGOD_INDEXER_ADDRESS, 8980);

      const suggestedParams = await getTransactionParams();
      const approvalProgram = Uint8Array.from([4, 129, 1, 67]);
      const clearProgram = Uint8Array.from([3, 129, 1, 67]);

      const createAppTxn = algosdk.makeApplicationCreateTxnFromObject({
        from: this.sessionWallet!.getDefaultAccount(),
        approvalProgram,
        clearProgram,
        numGlobalInts: 1,
        numGlobalByteSlices: 2,
        numLocalInts: 8,
        numLocalByteSlices: 2,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        note: new Uint8Array(Buffer.from("Create Auction App")),
        foreignApps: [environment.STORE_APP_ID],
        accounts: [getApplicationAddress(environment.STAKING_APP_ID), environment.TEAM_WALLET_ADDRESS],
        suggestedParams,
      })

      const signedTxns = await this.sessionWallet!.signTxn([createAppTxn]);
      const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
      await waitForTransaction(client, results.txId);
      console.log("Transaction : ", results);
      const txRes = await algod.pendingTransactionInformation(results.txId).do();
      console.log('appCreateResult', txRes);
      result.appId = txRes['application-index'];

      if (result.appId) {
        const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          to: getApplicationAddress(result.appId),
          amount: Number(100000),
          note: new Uint8Array(Buffer.from("Payment for created app minimum balance.")),
          suggestedParams,
        });

        const signedPayTxns = await this.sessionWallet!.signTxn([payTxn]);
        const paidResults = await client.sendRawTransaction(signedPayTxns.map(txn => txn.blob)).do();
        await waitForTransaction(client, paidResults.txId);
        console.log("Transaction : " + paidResults.txId);

        result.paidMinimumBalance = true
        return result;
      }

    } catch (err) {
      console.error(err);
    }

    return result;
  }

  createAuction = async (params: any): Promise<any> => {
    try {
      console.log(params);
      const suggestedParams = await getTransactionParams();
      let txns = [];
      let tokens = [Number(params.assetID)];

      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, params.auctionIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, params.auctionIndex, "TA");
      if (indexTokenID !== 0 && indexTokenID > 0 && indexTokenAmount > 0 && indexTokenID != params.assetID) {
        tokens.push(indexTokenID);
      }

      const fundingAmount = 101000;
      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.myAlgoAddress[0],
        to: getApplicationAddress(environment.AUCTION_APP_ID),
        amount: fundingAmount,
        note: new Uint8Array(Buffer.from("Amount to opt app into asset")),
        suggestedParams,
      });
      txns.push(payTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.myAlgoAddress[0],
        appIndex: environment.AUCTION_APP_ID,
        note: new Uint8Array(Buffer.from("Place auction")),
        appArgs: [new Uint8Array([...Buffer.from("setup")]),
                  algosdk.encodeUint64(Number(params.startTime)),
                  algosdk.encodeUint64(Number(params.endTime)),
                  algosdk.encodeUint64(Number(params.reserve)),
                  algosdk.encodeUint64(Number(params.minimumIncrement)),
                ],
        accounts: [params.auctionIndex],
        foreignAssets: tokens,
        suggestedParams,
      });
      txns.push(appCallTxn);

      const tokenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: this.myAlgoAddress[0],
        to: getApplicationAddress(environment.AUCTION_APP_ID),
        amount: Number(params.amount),
        assetIndex: Number(params.assetID),
        note: new Uint8Array(Buffer.from("Amount to place trade")),
        suggestedParams,
      });
      txns.push(tokenTxn);

      const txnGroup = algosdk.assignGroupID(txns);
      const signedTxns = await this.sessionWallet!.signTxn(txns);

      const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
      console.log("Transaction : " + JSON.stringify(results));
      await waitForTransaction(client, results.txId);

      return results.txId;

    } catch (err) {
      console.error(err);
    }

    return 0;
  }

  cancelAuction = async (auctionIndex: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, auctionIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, auctionIndex, "TA");

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.myAlgoAddress[0],
          appIndex: environment.SWAP_APP_ID,
          note: new Uint8Array(Buffer.from("Cancel swap")),
          appArgs: [new Uint8Array([...Buffer.from("cancel")])],
          accounts: [auctionIndex],
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        const result: any = await this.sessionWallet!.signTxn([appCallTxn])
        console.log("Cancel Transaction", JSON.stringify(result));
        await waitForTransaction(client, result.txId);

        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

}
