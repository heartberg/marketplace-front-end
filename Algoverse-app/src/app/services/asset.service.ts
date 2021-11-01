import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AssetHotModel} from "../models/asset-hot.model";

@Injectable({
  providedIn: "root"
})
export class AssetService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAssetBuyers(lastDays: number): Observable<AssetHotModel> {
    const url = `${this.baseUrl}/asset/get/hot`;
    return this._http.get<any>(url, {
      params: {
        lastDays: lastDays
      }
    })
  }

}
