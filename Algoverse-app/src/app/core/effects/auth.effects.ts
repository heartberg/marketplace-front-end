import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { AuthActionTypes } from "../actions/auth.actions"


@Injectable()

export class AuthEffects {
    logOut = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.LogoutAction),
        tap(() =>
            this.router.navigate(['landing-page'])
        )
    ), { dispatch: false }
    )


    constructor(
        private actions: Actions,
        private router: Router
    ) { }
}