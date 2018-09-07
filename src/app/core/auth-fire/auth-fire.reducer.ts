import { AppState } from '../core.state';

import * as userActions from './auth-fire.actions';
import { User } from './auth-fire.model';

export type Action = userActions.All;

const defaultUser = new User(
  null,
  'GUEST',
  'https://i.stack.imgur.com/nUJ73.png'
);

/**
 * Define all store queries for Post(s)
 */
export namespace UsersQuery {
  export const getUser = (state: AppState) => state.user;
}

// Reducer function
export function userReducer(state: User = defaultUser, action: Action) {
  switch (action.type) {
    case userActions.GET_USER:
      return { ...state, loading: true };

    case userActions.AUTHENTICATED:
      return { ...state, ...action.payload, loading: false };

    case userActions.NOT_AUTHENTICATED:
      return { ...state, ...defaultUser, loading: false };

    case userActions.GOOGLE_LOGIN:
      return { ...state, loading: true };

    case userActions.AUTH_ERROR:
      return { ...state, ...action.payload, loading: false };

    case userActions.LOGOUT_FIREBASE:
      return { ...state, loading: true };

    case userActions.LOGOUT_SUCCESS:
      return { ...state, ...defaultUser, loading: true };

    default:
      return state;
  }
}
