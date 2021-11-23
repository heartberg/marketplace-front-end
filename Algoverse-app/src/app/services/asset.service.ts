import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AssetHotModel} from "../models/asset-hot.model";

interface paramsInterface {
  params: {
    page: number,
    ordering?: string
  }
}


@Injectable({
  providedIn: "root"
})

export class AssetService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAssetBuyers(lastDays: number): Observable<AssetHotModel> {
    const url = `${this.baseUrl}/asset/get/hot`;
    return this._http.get<AssetHotModel>(url, {
      params: {
        lastDays: lastDays
      }
    })
  }

  getAllAssetMarketplace(pageId: number): Observable<AssetHotModel> {
    const url = `${this.baseUrl}/asset/get/allWithOpenTrade`;

    return this._http.get<AssetHotModel>(url, {
      params: {
        page: pageId,
      }
    })
  }

  getAllAssetMarketplaceBySort(pageId: number, ordering: string, walletId: string, collectionId: string | any): Observable<AssetHotModel> {
    const url = `${this.baseUrl}/asset/get/allWithOpenTrade`;
    return this._http.get<AssetHotModel>(url, {
      params: {
        page: pageId,
        ordering: ordering,
        wallet: walletId,
        collection: collectionId,
      }
    })
  }

  getAssetsByCollectionId(collectionId: string): Observable<any> {
    const url = `${this.baseUrl}/collection/get/byId`;
    return this._http.get<any>(url, {
      params: {
        collectionId: collectionId,
      }
    })
  }
}
