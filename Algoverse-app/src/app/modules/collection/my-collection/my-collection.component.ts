import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';
import { Location } from '@angular/common';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-my-collection',
  templateUrl: './my-collection.component.html',
  styleUrls: ['./my-collection.component.scss']
})
export class MyCollectionComponent implements OnInit {
  public mCollections = []

  constructor(
    private _walletsConnectService: WalletsConnectService,
    private _userService: UserService,
    private _stateService: StateService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    if (!Array.isArray(this._walletsConnectService.myAlgoAddress) || this._walletsConnectService.myAlgoAddress.length == 0) {
      this.router.navigate(['/', 'home']);
      return;
    }

    this._userService.loadCollections(this._walletsConnectService.sessionWallet!.getDefaultAccount()).subscribe(
      res => {
        console.log('res', res);
        this.mCollections = res;
        this._stateService.collections = res;
      },
      error => console.log(error)
    )
  }

  onBack() {
    this._location.back();
  }

}
