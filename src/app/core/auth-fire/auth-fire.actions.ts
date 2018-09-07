import { Action } from '@ngrx/store';
import { User } from './auth-fire.model';

export const GET_USER = '[Auth] Get user';
export const AUTHENTICATED = '[Auth] Authenticated';
export const NOT_AUTHENTICATED = '[Auth] Not Authenticated';

export const EMAIL_LOGIN = '[Auth] Email login attempt';
export const GOOGLE_LOGIN = '[Auth] Google login attempt';
export const LOGOUT_FIREBASE = '[Auth] Logout Firebase';
export const LOGOUT_SUCCESS = '[Auth] Logout success';

export const AUTH_ERROR = '[Auth] Error';

// Get User AuthState
export class GetUser implements Action {
  readonly type = GET_USER;
  constructor(public payload?: any) {}
}

export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public payload?: any) {}
}

export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
  constructor(public payload?: any) {}
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;
  constructor(public payload?: any) {}
}

// Google Login Actions
export class EmailLogin implements Action {
  readonly type = EMAIL_LOGIN;
  constructor(public payload?: any) {}
}

// Google Login Actions
export class GoogleLogin implements Action {
  readonly type = GOOGLE_LOGIN;
  constructor(public payload?: any) {}
}

// Logout Actions
export class LogoutFirebase implements Action {
  readonly type = LOGOUT_FIREBASE;
  constructor(public payload?: any) {}
}

// Logout Actions
export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
  constructor(public payload?: any) {}
}

export type All =
  | GetUser
  | Authenticated
  | NotAuthenticated
  | EmailLogin
  | GoogleLogin
  | AuthError
  | LogoutSuccess
  | LogoutFirebase;
