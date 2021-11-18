// @ts-ignore

import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UserHotModel} from "../models/user-hot.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  userGetShuttle(): Observable<any> {
    const url = `${this.baseUrl}/user/get/all/verified`;
    return this._http.get<any>(url);
  }

  getHotCreators(lastDays: number): Observable<UserHotModel> {
    const url = `${this.baseUrl}/user/get/hot`;
    return this._http.get<any>(url, {
      params: {
        lastDays: lastDays
      }
    })
  }

  getHotSellers(lastDays: number): Observable<UserHotModel> {
    const url = `${this.baseUrl}/user/get/hot/seller`;
    return this._http.get<any>(url, {
      params: {
        lastDays: lastDays
      }
    })
  }

  getHotBuyers(lastDays: number): Observable<UserHotModel> {
    const url = `${this.baseUrl}/user/get/hot/buyer`;
    return this._http.get<UserHotModel>(url, {
      params: {
        lastDays: lastDays
      }
    })
  }

  getUserByName(name: string): Observable<any> {
    const url = `${this.baseUrl}/user/get/byName`;
    return this._http.get<any>(url, {
      params: {
        name: name
      }
    })
  }
}
