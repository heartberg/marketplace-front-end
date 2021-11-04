import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TradeCreateModel} from "../models/trade-create.model";

@Injectable({
  providedIn: "root"
})

export class TradeService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  createTrade(data: any): Observable<TradeCreateModel> {
    const url = `${this.baseUrl}/trade/create`;
    return this._http.post<TradeCreateModel>(url, data)
  }
}
