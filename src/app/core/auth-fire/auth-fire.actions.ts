import { Action } from '@ngrx/store';
import { User } from './auth-fire.model';

export const GET_USER = '[Auth] Get user';
export const AUTHENTICATED = '[Auth] User Authenticated';
export const NOT_AUTHENTICATED = '[Auth] User NOT Authenticated';
export const EMAIL_LOGIN = '[Auth] Email login action';
export const GOOGLE_LOGIN = '[Auth] Google login action';
export const VERIFY_USER = '[Auth] Verify user';
export const LOGIN_SUCCESS = '[Auth] Login success';
export const LOGOUT_USER = '[Auth] Logout user';
export const LOGOUT_SUCCESS = '[Auth] Logout success';
export const WELCOME_USER = '[Auth] Welcome user';
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

// Email Login Actions
export class EmailLogin implements Action {
  readonly type = EMAIL_LOGIN;
  constructor(public payload?: any) {}
}

// Google Login Actions
export class GoogleLogin implements Action {
  readonly type = GOOGLE_LOGIN;
  constructor(public payload?: any) {}
}

// Verify User Actions
export class VerifyUser implements Action {
  readonly type = VERIFY_USER;
  constructor(public payload?: any) {}
}

// Login Success Actions
export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload?: any) {}
}

// Logout Actions
export class LogoutUser implements Action {
  readonly type = LOGOUT_USER;
  constructor(public payload?: any) {}
}

// Welcome User Actions
export class WelcomeUser implements Action {
  readonly type = WELCOME_USER;
  constructor(public payload?: any) {}
}

// Logout Success Actions
export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
  constructor(public payload?: any) {}
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;
  constructor(public payload?: any) {}
}

export type All =
  | GetUser
  | Authenticated
  | NotAuthenticated
  | EmailLogin
  | GoogleLogin
  | VerifyUser
  | LoginSuccess
  | LogoutUser
  | LogoutSuccess
  | WelcomeUser
  | AuthError;
