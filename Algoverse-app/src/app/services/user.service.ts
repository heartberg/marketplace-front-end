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

  cancelTrade(tradeIndex: string): Observable<any> {
    const url = `${this.baseUrl}trade/cancel`;
    return this._http.post(url, {tradeIndex});
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
    const url = `${this.baseUrl}bid/place`;
    return this._http.post(url, params);
  }

  cancelBid(bidIndex: string): Observable<any> {
    const url = `${this.baseUrl}bid/cancel`;
    return this._http.post(url, {bidIndex});
  }

  loadMetaData(url: string): Observable<any> {
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

  cancelSwap(swapIndex: string): Observable<any> {
    const url = `${this.baseUrl}swap/cancel`;
    return this._http.post(url, {swapIndex});
  }

  getAuctionIndex(senderAddress: string, assetId: number) {
    const url = `${this.baseUrl}auction/getAuctionIndexAndPrice?senderAddress=${senderAddress}&assetId=${assetId}`;
    return this._http.get<any>(url);
  }

  setupAuction(auctionIndex: string): Observable<any> {
    const url = `${this.baseUrl}auction/setup?auctionIndex=${auctionIndex}`;
    return this._http.get(url);
  }

  createAuction(params: any): Observable<any> {
    const url = `${this.baseUrl}auction/create`;
    return this._http.post(url, params);
  }

  cancelAuction(auctionIndex: string): Observable<any> {
    const url = `${this.baseUrl}auction/cancel`;
    return this._http.post(url, {auctionIndex});
  }

}
