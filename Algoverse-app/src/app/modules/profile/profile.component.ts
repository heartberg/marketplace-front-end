import { Component, OnInit } from '@angular/core';
import {Observable, pipe} from "rxjs";
import {AuthState} from "../../core/reducers/auth.reducer";
import {User} from "../../models/user.model";
import {Store} from "@ngrx/store";
import {isLoggedIn} from "../../core/selector/auth.selectors";
import {map} from "rxjs/operators";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileTitle: string = 'Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM '
  profileImg: string = 'https://www.annualreviews.org/pb-assets/journal-home/special-collections/collection-archive-extreme-weather-2021-1630444709857.png'
  public exampleArr:number[] = [1,2];

  // @ts-ignore
  profileInfo$: Observable<User | undefined>;

  constructor(private store: Store, private _authService: AuthService) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    // @ts-ignore
    let wallet = localStorage.getItem('wallet').toString();
    // @ts-ignore
    this.profileInfo$ = this._authService.getUserByWallet('BSOMH2YRF5DIYRLN5DEEXGV7EUIXC4BKXENJIRECRYINAPABSF37B52ZWY');
  }

}
