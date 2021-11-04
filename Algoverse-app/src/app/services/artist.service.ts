import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CollectionHotModel} from "../models/collection-hot.model";
import {ArtistsModel} from "../models/artists.model";

@Injectable({
  providedIn: "root"
})
export class ArtistService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAllArtists(): Observable<ArtistsModel> {
    const url = `${this.baseUrl}/user/get/all`;
    return this._http.get<ArtistsModel>(url)
  }

}
