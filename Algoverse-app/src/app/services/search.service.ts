import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = environment.baseUrl;

  public $searchResult: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public $searchValue: BehaviorSubject<string> = new BehaviorSubject<string>("");

  set setSearchResult(result: any) {
    this.$searchResult.next(result);
  }
  set setSearchValue (result: string) {
    this.$searchValue.next(result);
  }

  get searchResult(): any {
    return this.$searchResult.value;
  }
  get searchValue(): string {
    return this.$searchValue.value;
  }

  constructor(private readonly _http: HttpClient) { }

  public globalSearch(searchKey: string): Observable<any> {
    const url = `${this.baseUrl}global/searchGlobal`;
    return this._http.get<any>(url, {
      params: {
        searchKey
      }
    });
  }
}
