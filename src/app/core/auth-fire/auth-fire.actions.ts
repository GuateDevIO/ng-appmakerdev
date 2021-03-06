import { Action } from '@ngrx/store';

export const GET_USER = '[Auth] GET_USER action';
export const AUTHENTICATED = '[Auth] AUTHENTICATED action';
export const NOT_AUTHENTICATED = '[Auth] NOT_AUTHENTICATED action';
export const EMAIL_LOGIN = '[Auth] EMAIL_LOGIN action';
export const EMAIL_SIGN_UP = '[Auth] EMAIL_SIGN_UP action';
export const GOOGLE_LOGIN = '[Auth] GOOGLE_LOGIN action';
export const FACEBOOK_LOGIN = '[Auth] FACEBOOK_LOGIN action';
export const TWITTER_LOGIN = '[Auth] TWITTER_LOGIN action';
export const GITHUB_LOGIN = '[Auth] GITHUB_LOGIN action';
export const VERIFY_USER = '[Auth] VERIFY_USER action';
export const LOGIN_USER = '[Auth] LOGIN_USER action';
export const NEW_USER = '[Auth] NEW_USER action';
export const LOGIN_SUCCESS = '[Auth] LOGIN_SUCCESS action';
export const WELCOME_USER = '[Auth] WELCOME_USER action';
export const LOGOUT_USER = '[Auth] LOGOUT_USER action';
export const LOGOUT_SUCCESS = '[Auth] LOGOUT_SUCCESS action';
export const AUTH_ERROR = '[Auth] AUTH_ERROR action';

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

// Email Sign Up Actions
export class EmailSignUp implements Action {
  readonly type = EMAIL_SIGN_UP;
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

// Facebook Login Actions
export class FacebookLogin implements Action {
  readonly type = FACEBOOK_LOGIN;
  constructor(public payload?: any) {}
}

// Twitter Login Actions
export class TwitterLogin implements Action {
  readonly type = TWITTER_LOGIN;
  constructor(public payload?: any) {}
}

// Github Login Actions
export class GithubLogin implements Action {
  readonly type = GITHUB_LOGIN;
  constructor(public payload?: any) {}
}

// Verify User Actions
export class VerifyUser implements Action {
  readonly type = VERIFY_USER;
  constructor(public payload?: any) {}
}

// New User AuthState
export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  constructor(public payload?: any) {}
}

// New User AuthState
export class NewUser implements Action {
  readonly type = NEW_USER;
  constructor(public payload?: any) {}
}

// Login Success Actions
export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload?: any) {}
}

// Welcome User Actions
export class WelcomeUser implements Action {
  readonly type = WELCOME_USER;
  constructor(public payload?: any) {}
}

// Logout Actions
export class LogoutUser implements Action {
  readonly type = LOGOUT_USER;
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
  | EmailSignUp
  | EmailLogin
  | GoogleLogin
  | FacebookLogin
  | TwitterLogin
  | GithubLogin
  | VerifyUser
  | LoginUser
  | NewUser
  | LoginSuccess
  | WelcomeUser
  | LogoutUser
  | LogoutSuccess
  | AuthError;
