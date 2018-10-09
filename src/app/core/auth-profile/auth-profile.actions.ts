import { Action } from '@ngrx/store';
import { Profile } from './auth-profile.model';

export const GET_PROFILE = '[Profile] GET_PROFILE action';
export const GET_SUCCESS = '[Profile] GET_SUCCESS action';
export const GET_FAIL = '[Profile] GET_FAIL action';

export const CREATE_PROFILE = '[Profile] CREATE_PROFILE action';
export const CREATE_SUCCESS = '[Profile] CREATE_SUCCESS action';
export const CREATE_FAIL = '[Profile] CREATE_FAIL action';

export const UPDATE_PROFILE = '[Profile] UPDATE_PROFILE action';
export const UPDATE_SUCCESS = '[Profile] UPDATE_SUCCESS action';
export const UPDATE_FAIL = '[Profile] UPDATE_FAIL action';

export const DELETE_PROFILE = '[Profile] DELETE_PROFILE action';
export const DELETE_SUCCESS = '[Profile] DELETE_SUCCESS action';
export const DELETE_FAIL = '[Profile] DELETE_FAIL action';

export const SAVE_LOCAL_PROFILE = '[Profile] SAVE_LOCAL_PROFILE action';

export class GetProfile implements Action {
  readonly type = GET_PROFILE;
  constructor(public payload: string) {}
}

export class GetProfileSuccess implements Action {
  readonly type = GET_SUCCESS;
  constructor(public payload: Profile) {}
}

export class GetProfileFail implements Action {
  readonly type = GET_FAIL;
  constructor(public payload?: any) {}
}

export class CreateProfile implements Action {
  readonly type = CREATE_PROFILE;
  constructor(public payload: any) {}
}

export class CreateProfileSuccess implements Action {
  readonly type = CREATE_SUCCESS;
  constructor(public payload?: any) {}
}

export class CreateProfileFail implements Action {
  readonly type = CREATE_FAIL;
  constructor(public payload?: any) {}
}

export class UpdateProfile implements Action {
  readonly type = UPDATE_PROFILE;
  constructor(public payload: any) {}
}

export class UpdateProfileSuccess implements Action {
  readonly type = UPDATE_SUCCESS;
  constructor(public payload?: any) {}
}

export class UpdateProfileFail implements Action {
  readonly type = UPDATE_FAIL;
  constructor(public payload?: any) {}
}

export class DeleteProfile implements Action {
  readonly type = DELETE_PROFILE;
  constructor(public payload: any) {}
}

export class DeleteProfileSuccess implements Action {
  readonly type = DELETE_SUCCESS;
  constructor(public payload?: any) {}
}

export class DeleteProfileFail implements Action {
  readonly type = DELETE_FAIL;
  constructor(public payload?: any) {}
}

export class SaveLocalProfile implements Action {
  readonly type = SAVE_LOCAL_PROFILE;
  constructor(public payload?: any) {}
}

export type AllActions =
  | GetProfile
  | GetProfileSuccess
  | GetProfileFail
  | CreateProfile
  | CreateProfileSuccess
  | CreateProfileFail
  | UpdateProfile
  | UpdateProfileSuccess
  | UpdateProfileFail
  | DeleteProfile
  | DeleteProfileSuccess
  | DeleteProfileFail
  | SaveLocalProfile;
