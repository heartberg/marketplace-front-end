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

  getTradeIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}trade/getTradeIndexAndPrice?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  setupTrade(indexAddress: string): Observable<any> {
    const url = `${this.baseUrl}trade/setUpTrade?indexAddress=${indexAddress}`;
    return this._http.get(url);
  }

  createTrade(params: any): Observable<any> {
    const url = `${this.baseUrl}trade/create`;
    return this._http.post(url, params);
  }

  getBidIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}bid/getBidIndexAndPrice?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  setupBid(indexAddress: string): Observable<any> {
    const url = `${this.baseUrl}bid/setUpBid?indexAddress=${indexAddress}`;
    return this._http.get(url);
  }

  createBid(params: any): Observable<any> {
    const url = `${this.baseUrl}bid/place`;
    return this._http.post(url, params);
  }

  loadMetaData(url: string): Observable<any> {
    return this._http.get<any>(url);
  }

  getSwapIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}swap/getSwapIndexAndPrice?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  setupSwap(indexAddress: string, tokens: number[]): Observable<any> {
    const url = `${this.baseUrl}swap/setUpSwap?indexAddress=${indexAddress}`;
    const params = {
      indexAddress,
      tokens
    }
    return this._http.post(url, params);
  }

  createSwap(params: any): Observable<any> {
    const url = `${this.baseUrl}swap/create`;
    return this._http.post(url, params);
  }

}
