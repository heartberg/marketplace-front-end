import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CollectionHotModel} from "../models/collection-hot.model";
import {ArtistsModel, ArtistsModelObj} from "../models/artists.model";

@Injectable({
  providedIn: "root"
})
export class ArtistService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getAllArtists(): Observable<ArtistsModelObj[]> {
    const url = `${this.baseUrl}/user/get/all`;
    return this._http.get<ArtistsModelObj[]>(url)
  }

}
