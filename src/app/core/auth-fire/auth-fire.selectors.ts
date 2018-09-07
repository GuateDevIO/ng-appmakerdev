import { createSelector } from '@ngrx/store';

import { selectUserState } from '../core.state';
import { AppState } from '../core.state';

export const selectUser = createSelector(
  selectUserState,
  (state: AppState) => state
);
