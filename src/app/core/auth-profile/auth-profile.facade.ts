import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, pipe, of, from, defer } from 'rxjs';
import {
  map,
  mapTo,
  catchError,
  switchMap,
  mergeMap,
  concatMap,
  tap,
  take
} from 'rxjs/operators';

import { AppState } from '../core.state';
import { Profile } from './auth-profile.model';
import { ProfileQuery } from './auth-profile.reducer';

import * as userActions from '../auth-fire/auth-fire.actions';
import * as profileActions from './auth-profile.actions';
type Action = profileActions.AllActions;

@Injectable()
export class ProfileFacade {
  // ************************************************
  // Observable Queries available for consumption by views
  // ************************************************

  profile$ = this.store.select(ProfileQuery.getProfile);

  // ************************************************
  // Effects to be registered at the Module level
  // ************************************************

  @Effect()
  getProfile$: Observable<Action> = this.actions$.pipe(
    ofType(profileActions.GET_PROFILE),
    map((action: profileActions.GetProfile) => action.payload),
    mergeMap(payload => this.afs.doc<Profile>(`${payload}`).valueChanges()),
    map(profile => {
      if (profile) {
        return new profileActions.GetProfileSuccess(profile);
      } else {
        return new profileActions.GetProfileFail();
      }
    })
  );

  @Effect({ dispatch: false })
  getProfileSuccess$ = this.actions$.pipe(
    ofType(profileActions.GET_PROFILE_SUCCESS),
    tap(() => {
      console.log('getProfileSuccess$ action triggered!');
    })
  );

  @Effect({ dispatch: false })
  getProfileFail$ = this.actions$.pipe(
    ofType(profileActions.GET_PROFILE_FAIL),
    tap(() => {
      console.log('getProfileFail$ action triggered!');
    })
  );

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.AUTHENTICATED),
    map((action: userActions.Authenticated) => action.payload),
    concatMap(payload => [
      new profileActions.GetProfile(`/profiles/${payload.uid}`)
    ])
  );

  // ************************************************
  // Internal Code
  // ************************************************

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private afs: AngularFirestore
  ) {}

  loadPost(name = 'testPost'): Observable<Profile> {
    this.store.dispatch(new profileActions.GetProfile(`/profile/${name}`));
    return this.profile$;
  }

  vote(post: Profile, val: number): void {
    this.store.dispatch(new profileActions.UpdateProfile({ post, val }));
  }
}
