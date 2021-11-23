import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from "@ngrx/store";
import { AppState } from "../core/reducers";
import { isLoggedIn } from "../core/selector/auth.selectors";
import { tap } from "rxjs/operators";

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store
      .pipe(
        select(isLoggedIn),
        tap(
          (loggedIn) => {
            if (!loggedIn) {
              this.router.navigate(['../../']);
              console.log(false, 'false');
            } else {
              console.log(true, 'true')
            }
          }
        )
      )
  }

}
