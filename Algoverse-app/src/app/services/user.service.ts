// @ts-ignore

import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;
  public mUserInfo: any | undefined;

  constructor(private _http: HttpClient) {
  }

  loadProfile(wallet: String): Observable<any> {
    const url = `${this.baseUrl}user/get/byWallet?wallet=${wallet}`;
    return this._http.get<any>(url);
  }

  createProfile(wallet: String): Observable<any> {
    const url = `${this.baseUrl}user/create`;
    const params = {
      wallet
    }
    return this._http.post(url, params);
  }

  userGetShuttle(): Observable<any> {
    const url = `${this.baseUrl}user/get/all/verified`;
    return this._http.get<any>(url);
  }

  loadTrades(address: string): Observable<any> {
    const url = `${this.baseUrl}trade/searchByAddress?address=${address}`;
    return this._http.get<any>(url);
  }

  loadTradeItem(tradeId: string): Observable<any> {
    const url = `${this.baseUrl}trade/${tradeId}`;
    return this._http.get<any>(url);
  }

  getHot(): Observable<any> {
    const url = `${this.baseUrl}user/get/hot`;
    return this._http.get<any>(url);
  }

  getTradeIndex(senderAddress: string, assetId: number): Observable<any> {
    const url = `${this.baseUrl}trade/getTradeIndexAndPrice?senderAddress=${senderAddress}&assetId=${assetId}`;
    return this._http.get<any>(url);
  }

  setupTrade(indexAddress: string, assetId: number): Observable<any> {
    const url = `${this.baseUrl}trade/setUpTrade?indexAddress=${indexAddress}&assetId=${assetId}`;
    return this._http.get(url);
  }

  createTrade(params: any): Observable<any> {
    const url = `${this.baseUrl}trade/create`;
    return this._http.post(url, params);
  }

  cancelTrade(tradeId: string): Observable<any> {
    const url = `${this.baseUrl}trade/cancel?tradeId=${tradeId}`;
    return this._http.post(url, {tradeId});
  }

  acceptTrade(tradeId: string, accepter: string): Observable<any> {
    const url = `${this.baseUrl}trade/accept?tradeId=${tradeId}&acceptorWallet=${accepter}`;
    return this._http.post(url, {tradeId});
  }

  loadBids(address: string): Observable<any> {
    const url = `${this.baseUrl}bid/searchByAddress?address=${address}`;
    return this._http.get<any>(url);
  }

  loadBidItem(bidId: string): Observable<any> {
    const url = `${this.baseUrl}bid/${bidId}`;
    return this._http.get<any>(url);
  }

  getBidIndex(senderAddress: string, assetId: number): Observable<any> {
    const url = `${this.baseUrl}bid/getBidIndexAndPrice?senderAddress=${senderAddress}&assetId=${assetId}`;
    return this._http.get<any>(url);
  }

  setupBid(indexAddress: string, assetId: number): Observable<any> {
    const url = `${this.baseUrl}bid/setUpBid?indexAddress=${indexAddress}&assetId=${assetId}`;
    return this._http.get(url);
  }

  createBid(params: any): Observable<any> {
    const url = `${this.baseUrl}bid/create`;
    return this._http.post(url, params);
  }

  cancelBid(bidId: string): Observable<any> {
    const url = `${this.baseUrl}bid/cancel?bidId=${bidId}`;
    return this._http.post(url, {bidId});
  }

  acceptBid(bidId: string, accepter: string): Observable<any> {
    const url = `${this.baseUrl}bid/accept?bidId=${bidId}&acceptor=${accepter}`;
    return this._http.post(url, {});
  }

  loadTrendingItems(): Observable<any> {
    const url = `${this.baseUrl}global/trending`;
    return this._http.get<any>(url);
  }

  loadMetaData(url: string): Observable<any> {
    return this._http.get<any>(url);
  }

  loadSwapItem(swapId: string): Observable<any> {
    const url = `${this.baseUrl}swap/${swapId}`;
    return this._http.get<any>(url);
  }

  loadSwaps(address: string): Observable<any> {
    const url = `${this.baseUrl}swap/searchByAddress?address=${address}`;
    return this._http.get<any>(url);
  }

  getSwapIndex(params: any): Observable<any> {
    const url = `${this.baseUrl}swap/getSwapIndexAndPrice?senderAddress=${params.senderAddress}&offerAssetId=${params.offerAssetId}&acceptAssetId=${params.acceptAssetId}`;
    return this._http.get<any>(url);
  }

  setupSwap(params: any): Observable<any> {
    const url = `${this.baseUrl}swap/setUpSwap`;
    return this._http.post(url, params);
  }

  createSwap(params: any): Observable<any> {
    const url = `${this.baseUrl}swap/create`;
    return this._http.post(url, params);
  }

  cancelSwap(swapId: string): Observable<any> {
    const url = `${this.baseUrl}swap/cancel?swapId=${swapId}`;
    return this._http.post(url, {swapId});
  }

  acceptSwap(swapId: string, acceptorWallet: string): Observable<any> {
    const url = `${this.baseUrl}swap/accept?swapId=${swapId}&acceptorWallet=${acceptorWallet}`;
    return this._http.post(url, {swapId});
  }

  loadAuctions(address: string): Observable<any> {
    const url = `${this.baseUrl}auction/searchByAddress?wallet=${address}`;
    return this._http.get<any>(url);
  }

  loadAuctionItem(auctionId: string): Observable<any> {
    const url = `${this.baseUrl}auction/${auctionId}`;
    return this._http.get<any>(url);
  }

  getAuctionIndex(senderAddress: string, assetId: number) {
    const url = `${this.baseUrl}auction/getAuctionIndexAndPrice?senderAddress=${senderAddress}&assetId=${assetId}`;
    return this._http.get<any>(url);
  }

  setupAuction(auctionIndex: string, assetId: number): Observable<any> {
    const url = `${this.baseUrl}auction/setup?auctionIndex=${auctionIndex}&assetId=${assetId}`;
    return this._http.get(url);
  }

  createAuction(params: any): Observable<any> {
    const url = `${this.baseUrl}auction/create`;
    return this._http.post(url, params);
  }

  closeAuction(auctionId: string): Observable<any> {
    const url = `${this.baseUrl}auction/close?auctionId=${auctionId}`;
    return this._http.post(url, {auctionId});
  }

  bidAuction(params: any): Observable<any> {
    const url = `${this.baseUrl}auction/bid`;
    return this._http.post(url, params);
  }

}
