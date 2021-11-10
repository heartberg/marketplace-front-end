import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import {User} from "../../models/user.model";

type Authstate = {
  loggedIn: boolean,
  user: User | undefined
}

export interface AppState {
  auth: Authstate,
}
// @ts-ignore
function authReducer(state: Authstate, action: any):Authstate {

}


export const reducers: ActionReducerMap<AppState> = {
  // @ts-ignore
  auth: authReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
