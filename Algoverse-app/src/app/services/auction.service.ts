import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuctionService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAllAuctionMarketplace(pageId: number): Observable<any> {
    const url = `${this.baseUrl}/auction/all/open`;
    return this._http.get<any>(url, {
      params: {
        page: pageId,
      }
    })
  }

  getAllAuctionMarketplaceOrdering(pageId: number, ordering: string): Observable<any> {
    const url = `${this.baseUrl}/auction/all/open`;
    return this._http.get<any>(url, {
      params: {
        page: pageId,
        ordering: ordering
      }
    })
  }
}
