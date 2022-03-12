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
    const url = `${this.baseUrl}/user/get/byWallet?wallet=${wallet}`;
    return this._http.get<any>(url);
  }

  userGetShuttle(): Observable<any> {
    const url = `${this.baseUrl}/user/get/all/verified`;
    return this._http.get<any>(url);
  }

  getHot(): Observable<any> {
    const url = `${this.baseUrl}/user/get/hot`;
    return this._http.get<any>(url);
  }

  getTradeIndex(senderAddress: string): Observable<any> {
    const url = `${this.baseUrl}/trade/getTradeIndexAndPrice?senderAddress=${senderAddress}`;
    return this._http.get<any>(url);
  }

  createTrade(params: any): Observable<any> {
    const url = `${this.baseUrl}/user/get/hot`;
    return this._http.post(url, params);
  }

  loadMetaData(url: string): Observable<any> {
    return this._http.get<any>(url);
  }
}
