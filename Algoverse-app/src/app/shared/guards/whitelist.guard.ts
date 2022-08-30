import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from "../../services/user.service";
import {tap} from "rxjs/operators";
import {WhitelistService} from "../../services/whitelist.service";

@Injectable({
  providedIn: 'root'
})
export class WhitelistGuard implements CanActivate {

  constructor(
    private readonly _userService: UserService,
    private readonly whitelistService: WhitelistService, private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const wallet = localStorage.getItem("wallet");

    if (!wallet) {
      this.router.navigate(['/']);
      return false;
    }

    return this._userService.checkAddressInWhitelist(wallet).pipe(tap((isWhiteListed: boolean) => {
      this.whitelistService.isWhitelistedValue = isWhiteListed;
      if (!isWhiteListed) {
        this.router.navigate(['/']);
      }
    }));
  }
}
