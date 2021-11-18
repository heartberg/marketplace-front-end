import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class SwapService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAllSwapMarketplace(pageId: number): Observable<any> {
    const url = `${this.baseUrl}/swap/get/open`;
    return this._http.get<any>(url, {
      params: {
        page: pageId,
      }
    })
  }

  createSwap(data: any): Observable<any> {
    const url = `${this.baseUrl}/swap/create`;
    return this._http.post<any>(url, data)
  }
}
