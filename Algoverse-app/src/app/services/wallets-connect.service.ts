import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import algosdk, { Algodv2, Indexer, IntDecoding, BaseHTTPClient, getApplicationAddress, encodeAddress } from 'algosdk';
import AccountInformation from 'algosdk/dist/types/src/client/v2/algod/accountInformation';
import GetAssetByID from 'algosdk/dist/types/src/client/v2/algod/getAssetByID';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { getAlgodClient, getAppGlobalState, getAppLocalStateByKey, getBalance, getTransactionParams, isOptinApp, isOptinAsset, optinApp, optinAsset, singleAssetOptInTxn, singlePayTxn, waitForTransaction } from './utils.algod';
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
    console.log('myAlgoAddress', this.myAlgoAddress);
    localStorage.setItem('wallet', this.sessionWallet.getDefaultAccount())
    this.myAlgoName = this.myAlgoAddress.map((value: { name: any; }) => value.name)

    if (this.myAlgoAddress.length > 0) {
      this.userServce.loadProfile(this.sessionWallet!.getDefaultAccount()).subscribe(
        (result) => console.log('profile', result),
        (error) => {
          console.log('error', error)
          if (error.status == 404) {
            this.userServce.createProfile(this.sessionWallet!.getDefaultAccount()).subscribe(
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
        const accountInfo = await algod.accountInformation(this.sessionWallet!.getDefaultAccount()).do();
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
      const txn = await singlePayTxn(this.sessionWallet!.getDefaultAccount(), rekeyedIndex, amount, "Payment for trade setup to opt app into asset");
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
        from: this.sessionWallet!.getDefaultAccount(),
        to: getApplicationAddress(environment.TRADE_APP_ID),
        amount: Number(params.amount),
        assetIndex: Number(params.assetID),
        note: new Uint8Array(Buffer.from("Amount to place trade")),
        suggestedParams,
      });
      txns.push(tokenTxn);

      suggestedParams.fee = 0;
      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.sessionWallet!.getDefaultAccount(),
        appIndex: environment.TRADE_APP_ID,
        note: new Uint8Array(Buffer.from("Place trade")),
        appArgs: [new Uint8Array([...Buffer.from("trade")]),
                  algosdk.encodeUint64(Number(params.price))],
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
      console.log(indexTokenID, indexTokenAmount)

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.TRADE_APP_ID,
          note: new Uint8Array(Buffer.from("Cancel trade")),
          appArgs: [new Uint8Array([...Buffer.from("cancel")])],
          accounts: [tradeIndex],
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        const signedTxns = await this.sessionWallet!.signTxn([appCallTxn])
        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Cancel Transaction", JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  acceptTrade = async (tradeIndex: string, seller: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const isOptedInApp = await isOptinApp(environment.TRADE_APP_ID, tradeIndex)
      if (!isOptedInApp) {
        console.log('Invalid trade item')
        return false;
      }

      const indexTokenID = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, tradeIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, tradeIndex, "TA");
      const tradingPrice = await getAppLocalStateByKey(client, environment.TRADE_APP_ID, tradeIndex, "TP");
      console.log('token id', indexTokenID);
      console.log('token amount', indexTokenAmount);
      console.log('token price', tradingPrice);

      if (indexTokenID > 0 && indexTokenAmount > 0) {

        const balance = await getBalance(this.sessionWallet!.getDefaultAccount());
        if (balance < Number(tradingPrice) + 4000 + 3000) {
          console.log('Insufficient Balance');
          return false;
        }

        const storeAppId = await getAppGlobalState(environment.TRADE_APP_ID, "SA_ID");
        const isOptinStoreApp = await isOptinApp(storeAppId, this.sessionWallet!.getDefaultAccount())
        console.log('isOptinStoreApp :' + storeAppId, isOptinStoreApp)
        if (!isOptinStoreApp) {
          const result = await optinApp(storeAppId, this.sessionWallet!.wallet);
          if (!result) {
            console.log('Failed on optin store app');
            return false;
          }
        }

        const isOptedInAsset = await isOptinAsset(indexTokenID, this.sessionWallet!.getDefaultAccount())
        console.log('isOptedInAsset', isOptedInAsset)
        if (!isOptedInAsset) {
          const result = await optinAsset(indexTokenID, this.sessionWallet!.wallet);
          if (!result) {
            console.log('Failed on optin asset');
            return false;
          }
        }

        let txns = [];
        let tokens = [Number(indexTokenID)];
        const suggestedParams = await getTransactionParams();
        const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          to: getApplicationAddress(environment.TRADE_APP_ID),
          amount: Number(tradingPrice) + 4000,
          note: new Uint8Array(Buffer.from("Amount to accept trade")),
          suggestedParams,
        });
        txns.push(payTxn);

        let accounts = [
          seller,
          tradeIndex,
          await getAppGlobalState(environment.TRADE_APP_ID, 'SA_ADDR'),
          await getAppGlobalState(environment.TRADE_APP_ID, 'TW_ADDR')
        ];
        console.log('accounts', accounts);

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.TRADE_APP_ID,
          note: new Uint8Array(Buffer.from("Accept trade")),
          appArgs: [new Uint8Array([...Buffer.from("accept")]),
                    algosdk.encodeUint64(Number(indexTokenAmount))],
          accounts,
          foreignAssets: tokens,
          suggestedParams,
        });
        txns.push(appCallTxn);

        const storeAppCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: storeAppId,
          note: new Uint8Array(Buffer.from("Store trading amounts")),
          appArgs: [new Uint8Array([...Buffer.from("buy")])],
          accounts: [seller],
          suggestedParams,
        });
        txns.push(storeAppCallTxn);

        const txnGroup = algosdk.assignGroupID(txns);
        const signedTxns = await this.sessionWallet!.signTxn(txns);

        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Transaction : " + JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        console.log('Invalid trade item');
        return false;
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
        from: this.sessionWallet!.getDefaultAccount(),
        to: getApplicationAddress(environment.BID_APP_ID),
        amount: Number(params.price),
        note: new Uint8Array(Buffer.from("Amount to place bid")),
        suggestedParams,
      });
      txns.push(payTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.sessionWallet!.getDefaultAccount(),
        appIndex: environment.BID_APP_ID,
        note: new Uint8Array(Buffer.from("Place bid")),
        appArgs: [new Uint8Array([...Buffer.from("bid")]),
                  algosdk.encodeUint64(Number(params.amount))],
        accounts: [params.bidIndex],
        foreignAssets: tokens,
        suggestedParams,
      });
      // const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
      //   from: this.sessionWallet!.getDefaultAccount(),
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
      console.log(indexTokenID, indexTokenAmount)

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
        const signedTxns = await this.sessionWallet!.signTxn([appCallTxn])
        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Cancel Transaction", JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  acceptBid = async (bidIndex: string, bidder: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const isOptedInApp = await isOptinApp(environment.BID_APP_ID, bidIndex)
      if (!isOptedInApp) {
        console.log('Invalid bid item')
        return false;
      }

      const indexTokenID = await getAppLocalStateByKey(client, environment.BID_APP_ID, bidIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.BID_APP_ID, bidIndex, "TA");
      const bidPrice = await getAppLocalStateByKey(client, environment.BID_APP_ID, bidIndex, "TP");
      console.log('token id', indexTokenID);
      console.log('token amount', indexTokenAmount);
      console.log('token price', bidPrice);

      if (indexTokenID > 0 && indexTokenAmount > 0) {

        const balance = await getBalance(this.sessionWallet!.getDefaultAccount(), indexTokenID);
        if (balance < Number(indexTokenAmount)) {
          console.log('Failed, Insufficient token holding');
          return false;
        }

        const isOptedInAsset = await isOptinAsset(indexTokenID, getApplicationAddress(environment.BID_APP_ID))
        console.log('isOptedInAsset', isOptedInAsset)
        if (!isOptedInAsset) {
          console.log('Invalid bid item, was not setup');
          return false;
        }

        const storeAppId = await getAppGlobalState(environment.BID_APP_ID, "SA_ID");
        const isOptinStoreApp = await isOptinApp(storeAppId, this.sessionWallet!.getDefaultAccount())
        console.log('isOptinStoreApp :' + storeAppId, isOptinStoreApp)
        if (!isOptinStoreApp) {
          const result = await optinApp(storeAppId, this.sessionWallet!.wallet);
          if (!result) {
            console.log('Failed on optin store app');
            return false;
          }
        }

        let txns = [];
        let tokens = [Number(indexTokenID)];
        const suggestedParams = await getTransactionParams();

        const assetTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          to: getApplicationAddress(environment.BID_APP_ID),
          assetIndex: Number(indexTokenID),
          amount: Number(indexTokenAmount),
          note: new Uint8Array(Buffer.from("Transfer assets to accept bid")),
          suggestedParams,
        });
        txns.push(assetTxn);

        let accounts = [
          bidder,
          bidIndex,
          await getAppGlobalState(environment.BID_APP_ID, 'SA_ADDR'),
          await getAppGlobalState(environment.BID_APP_ID, 'TW_ADDR')
        ];
        console.log('accounts', accounts);

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.BID_APP_ID,
          note: new Uint8Array(Buffer.from("Accept bid")),
          appArgs: [new Uint8Array([...Buffer.from("accept")]),
                    algosdk.encodeUint64(Number(bidPrice))],
          accounts,
          foreignAssets: tokens,
          suggestedParams,
        });
        txns.push(appCallTxn);

        const storeAppCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: storeAppId,
          note: new Uint8Array(Buffer.from("Store bid accepting amounts")),
          appArgs: [new Uint8Array([...Buffer.from("sell")])],
          accounts: [bidder],
          suggestedParams,
        });
        txns.push(storeAppCallTxn);

        const txnGroup = algosdk.assignGroupID(txns);
        const signedTxns = await this.sessionWallet!.signTxn(txns);

        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Transaction : " + JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        console.log('Invalid bid item');
        return false;
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
        from: this.sessionWallet!.getDefaultAccount(),
        to: getApplicationAddress(environment.SWAP_APP_ID),
        amount: Number(params.amount),
        assetIndex: Number(params.assetID),
        note: new Uint8Array(Buffer.from("Amount to place swap")),
        suggestedParams: { ...suggestedParams },
      });
      console.log('tokenTxn', tokenTxn)
      txns.push(tokenTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.sessionWallet!.getDefaultAccount(),
        appIndex: environment.SWAP_APP_ID,
        note: new Uint8Array(Buffer.from("Place swap")),
        appArgs: [new Uint8Array(Buffer.from("swap")),
                  algosdk.encodeUint64(Number(params.acceptAssetAmount))],
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
      const indexTokenID = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "O_TKID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "O_AMT");
      console.log(indexTokenID, indexTokenAmount)

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.SWAP_APP_ID,
          note: new Uint8Array(Buffer.from("Cancel swap")),
          appArgs: [new Uint8Array([...Buffer.from("cancel")])],
          accounts: [swapIndex],
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        const signedTxns = await this.sessionWallet!.signTxn([appCallTxn])
        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Cancel Transaction", JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  acceptSwap = async (swapIndex: string, offer: string): Promise<boolean> => {
    try {
      const client = getAlgodClient();
      const isOptedInApp = await isOptinApp(environment.SWAP_APP_ID, swapIndex)
      if (!isOptedInApp) {
        console.log('Invalid swap item')
        return false;
      }

      //const offer = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "O_ADDR");
      const offeringTokenID = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "O_TKID");
      const offeringTokenAmount = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "O_AMT");
      const acceptingTokenID = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "A_TKID");
      const acceptingTokenAmount = await getAppLocalStateByKey(client, environment.SWAP_APP_ID, swapIndex, "A_AMT");
      console.log('offer', offer);
      console.log('offeringTokenID', offeringTokenID);
      console.log('offeringTokenAmount', offeringTokenAmount);
      console.log('acceptingTokenID', acceptingTokenID);
      console.log('acceptingTokenAmount', acceptingTokenAmount);

      if (offeringTokenID > 0 && offeringTokenAmount > 0 && acceptingTokenID > 0 && acceptingTokenAmount > 0) {

        const balance = await getBalance(this.sessionWallet!.getDefaultAccount(), acceptingTokenID);
        if (balance < acceptingTokenAmount) {
          console.log('Insufficient Balance');
          return false;
        }

        const isOptedInAsset = await isOptinAsset(offeringTokenID, this.sessionWallet!.getDefaultAccount())
        console.log('isOptedInAsset', isOptedInAsset)
        if (!isOptedInAsset) {
          const result = await optinAsset(offeringTokenID, this.sessionWallet!.wallet);
          if (!result) {
            console.log('Failed on optin asset');
            return false;
          }
        }

        let txns = [];
        let tokens = [Number(offeringTokenID), Number(acceptingTokenID)];
        const suggestedParams = await getTransactionParams();

        const assetTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          to: getApplicationAddress(environment.SWAP_APP_ID),
          assetIndex: Number(acceptingTokenID),
          amount: Number(acceptingTokenAmount),
          note: new Uint8Array(Buffer.from("Transfer assets to accept swap")),
          suggestedParams,
        });
        txns.push(assetTxn);

        let accounts = [
          offer,
          swapIndex,
          await getAppGlobalState(environment.SWAP_APP_ID, 'SA_ADDR'),
          await getAppGlobalState(environment.SWAP_APP_ID, 'TW_ADDR')
        ];
        console.log('accounts', accounts);

        suggestedParams.fee = 3000
        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.SWAP_APP_ID,
          note: new Uint8Array(Buffer.from("Accept swap")),
          appArgs: [new Uint8Array([...Buffer.from("accept")]),
                    algosdk.encodeUint64(Number(offeringTokenAmount))],
          accounts,
          foreignAssets: tokens,
          suggestedParams,
        });
        txns.push(appCallTxn);

        const txnGroup = algosdk.assignGroupID(txns);
        const signedTxns = await this.sessionWallet!.signTxn(txns);

        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Transaction : " + JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        console.log('Invalid swap item');
        return false;
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
      console.log('params', params);
      const suggestedParams = await getTransactionParams();
      let txns = [];
      let tokens = [Number(params.assetID)];

      const client = getAlgodClient();
      const indexTokenID = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, params.auctionIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, params.auctionIndex, "TKA");
      if (indexTokenID !== 0 && indexTokenID > 0 && indexTokenAmount > 0 && indexTokenID != params.assetID) {
        tokens.push(indexTokenID);
      }
      console.log('tokens', tokens);

      const fundingAmount = 101000;
      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.sessionWallet!.getDefaultAccount(),
        to: getApplicationAddress(environment.AUCTION_APP_ID),
        amount: fundingAmount,
        note: new Uint8Array(Buffer.from("Amount to opt app into asset")),
        suggestedParams,
      });
      txns.push(payTxn);

      const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: this.sessionWallet!.getDefaultAccount(),
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
        from: this.sessionWallet!.getDefaultAccount(),
        to: getApplicationAddress(environment.AUCTION_APP_ID),
        amount: Number(params.amount),
        assetIndex: Number(params.assetID),
        note: new Uint8Array(Buffer.from("Amount to place auction")),
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
      const indexTokenID = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, auctionIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, auctionIndex, "TKA");
      console.log(indexTokenID, indexTokenAmount)

      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const suggestedParams = await getTransactionParams();
        suggestedParams.fee = 2000;

        let accounts = [auctionIndex];
        const leadBidder = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, auctionIndex, "LB_ADDR")
        console.log("leadBidder", encodeAddress(leadBidder));
        if (leadBidder && leadBidder != 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') {
          accounts.push(leadBidder);
        }
        const stakingAddress = await getAppGlobalState(environment.AUCTION_APP_ID, "SA_ADDR");
        console.log("stakingAddress", stakingAddress);
        accounts.push(stakingAddress);
        const teamWallet = await getAppGlobalState(environment.AUCTION_APP_ID, "TW_ADDR");
        console.log("teamWallet", teamWallet);
        accounts.push(teamWallet);

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.AUCTION_APP_ID,
          note: new Uint8Array(Buffer.from("Close Auction")),
          appArgs: [new Uint8Array([...Buffer.from("close")])],
          accounts: accounts,
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        const signedTxns = await this.sessionWallet!.signTxn([appCallTxn])
        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Cancel Transaction", JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return true;

      } else {
        return true;
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

  bidAuction = async (auctionIndex: string, bidAmount: number) => {
    try {
      const client = getAlgodClient();
      const suggestedParams = await getTransactionParams();

      const ioa_index = await isOptinApp(environment.AUCTION_APP_ID, auctionIndex)
      if (!ioa_index) {
        console.error('Invalid auction item');
        return false;
      }

      const indexTokenID = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, auctionIndex, "TK_ID");
      const indexTokenAmount = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, auctionIndex, "TKA");
      if (indexTokenID > 0 && indexTokenAmount > 0) {
        const ioa = await isOptinAsset(indexTokenID, this.sessionWallet!.getDefaultAccount())
        if (!ioa) {
          const optinResult = optinAsset(indexTokenID, this.sessionWallet!.wallet)
          if (!optinResult) {
            console.error('Failed to optin asset, retry later');
            return false;
          }
        }

        const storeAppId = await getAppGlobalState(environment.AUCTION_APP_ID, "SA_ID");
        const isOptinStoreApp = await isOptinApp(storeAppId, this.sessionWallet!.getDefaultAccount())
        console.log('isOptinStoreApp :' + storeAppId, isOptinStoreApp)
        if (!isOptinStoreApp) {
          const result = await optinApp(storeAppId, this.sessionWallet!.wallet);
          if (!result) {
            console.log('Failed on optin store app');
            return false;
          }
        }

        let accounts = [auctionIndex];
        const leadBidder = await getAppLocalStateByKey(client, environment.AUCTION_APP_ID, auctionIndex, "LB_ADDR")
        if (leadBidder) {
          //const leadBidderAddress = encodeAddress(leadBidder)
          //console.log("leadBidder", leadBidderAddress);
          accounts.push(leadBidder);
        }

        let txns = [];

        const fundingAmount = bidAmount;
        const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          to: getApplicationAddress(environment.AUCTION_APP_ID),
          amount: Number(fundingAmount),
          note: new Uint8Array(Buffer.from("Payment to bid on auction")),
          suggestedParams,
        });
        txns.push(payTxn);

        const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: this.sessionWallet!.getDefaultAccount(),
          appIndex: environment.AUCTION_APP_ID,
          note: new Uint8Array(Buffer.from("Bid Auction")),
          appArgs: [new Uint8Array([...Buffer.from("bid")])],
          accounts: accounts,
          foreignAssets: [indexTokenID],
          suggestedParams,
        });
        txns.push(appCallTxn)

        const txnGroup = algosdk.assignGroupID(txns);
        const signedTxns = await this.sessionWallet!.signTxn(txns);

        const results = await client.sendRawTransaction(signedTxns.map(txn => txn.blob)).do();
        console.log("Transaction : " + JSON.stringify(results));
        await waitForTransaction(client, results.txId);

        return results.txId;

      } else {
        console.error('Invalid auction item');
      }
    } catch (err) {
      console.error(err)
    }

    return false;
  }

}
