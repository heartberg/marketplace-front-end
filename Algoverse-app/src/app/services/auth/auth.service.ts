import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArtistsModelObj} from "../../models/artists.model";
import {User} from "../../models/user.model";

@Injectable({
  providedIn: "root"
})

export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getUserByWallet(wallet: string): Observable<User> {
    const url = `${this.baseUrl}/user/get/byWallet`;
    return this._http.get<User>(url, {
      params: {
        wallet: wallet
      }
    })
  }
}
