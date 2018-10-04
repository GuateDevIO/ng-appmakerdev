import { Action } from '@ngrx/store';
import { Profile } from './auth-profile.model';

export const GET_PROFILE = '[Profile] GET_PROFILE action';
export const GET_PROFILE_SUCCESS = '[Profile] GET_PROFILE_SUCCESS action';
export const GET_PROFILE_FAIL = '[Profile] GET_PROFILE_FAIL action';

export const UPDATE_PROFILE = '[Profile] UPDATE_PROFILE action';
export const UPDATE_SUCCESS = '[Profile] UPDATE_SUCCESS action';
export const UPDATE_FAIL = '[Profile] UPDATE_FAIL action';

export class GetProfile implements Action {
  readonly type = GET_PROFILE;
  constructor(public payload: string) {}
}

export class GetProfileSuccess implements Action {
  readonly type = GET_PROFILE_SUCCESS;
  constructor(public payload: Profile) {}
}

export class GetProfileFail implements Action {
  readonly type = GET_PROFILE_FAIL;
  constructor(public payload?: any) {}
}

export class UpdateProfile implements Action {
  readonly type = UPDATE_PROFILE;
  constructor(public payload: any) {}
}

export class UpdateSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload?: any) {}
}

export class UpdateFail implements Action {
  readonly type = UPDATE_FAIL;
  constructor(public payload?: any) {}
}

export type AllActions =
  | GetProfile
  | GetProfileSuccess
  | GetProfileFail
  | UpdateProfile
  | UpdateSuccess
  | UpdateFail;
