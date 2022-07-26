import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class AssetService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAssetDetail(assetId: any): Observable<any> {
    const url = `${this.baseUrl}asset/get/fullById?assetId=${assetId}`;
    return this._http.get<any>(url);
  }
}
