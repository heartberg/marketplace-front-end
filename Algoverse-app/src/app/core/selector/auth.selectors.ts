import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthState = (state: any) => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  auth => auth.loggedIn
);

export const isLoggedOut = createSelector (
  isLoggedIn,
  loggedIn => !loggedIn
);
