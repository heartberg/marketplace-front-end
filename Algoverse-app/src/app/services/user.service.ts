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

  constructor(private _http: HttpClient) {
  }

  userGetShuttle(): Observable<any> {
    const url = `${this.baseUrl}/user/get/forVote`;
    return this._http.get<any>(url);
  }
}
