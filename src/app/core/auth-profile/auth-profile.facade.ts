import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

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

export const FORM_KEY = 'AUTH-PROFILE';
export const AUTH_FIRE_KEY = 'AUTH-FIRE';

@Injectable()
export class ProfileFacade {
  // ************************************************
  // Observable Queries available for consumption by views
  // ************************************************

  profile$ = this.store.pipe(select(ProfileQuery.getProfile));

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
        console.log('getProfile$ > PROFILE FOUND/UPDATED');
        return new profileActions.GetProfileSuccess(profile);
      } else {
        console.log('getProfile$ > PROFILE NOT FOUND/UPDATED');
        return new profileActions.GetProfileFail();
      }
    })
  );

  @Effect()
  createProfile$: Observable<Action> = this.actions$.pipe(
    ofType(profileActions.CREATE_PROFILE),
    map((action: profileActions.CreateProfile) => action.payload),
    switchMap(payload => {
      const ref = this.afs.doc<Profile>(`profiles/${payload.uid}`);
      return from(ref.set(payload));
    }),
    map(() => {
      console.log('createProfile$ > action.CreateProfileSuccess');
      return new profileActions.CreateProfileSuccess();
    }),
    catchError((err, caught) => {
      console.log('getProfile$ > FAIL / ERROR');
      this.store.dispatch(
        new profileActions.CreateProfileFail({ error: err.message })
      );
      return caught;
    })
  );

  /*
  @Effect({ dispatch: false })
  getProfileSuccess$ = this.actions$.pipe(
    ofType(profileActions.GET_PROFILE_SUCCESS),
    tap(() => {
      this.localStorageService.setItem(AUTH_KEY, payload)
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
  */

  @Effect({ dispatch: false })
  createProfileSuccess$ = this.actions$.pipe(
    ofType(profileActions.CREATE_SUCCESS),
    map((action: profileActions.CreateProfileSuccess) => action.payload),
    tap(payload => {
      console.log('createProfileSuccess$ > SUCCESS *test');
    })
  );

  @Effect({ dispatch: false })
  updateProfile$: Observable<Action> = this.actions$.pipe(
    ofType(profileActions.UPDATE_PROFILE),
    map((action: profileActions.UpdateProfile) => action.payload),
    tap(payload => {
      console.log('updateProfile$ > SUCCESS *test');
    })
  );

  @Effect({ dispatch: false })
  saveProfileLocal = this.actions$.pipe(
    ofType(profileActions.SAVE_LOCAL_PROFILE),
    map((action: profileActions.SaveLocalProfile) => action.payload),
    tap(payload => {
      console.log('saveProfileLocal$ > SUCCESS *test');
      this.localStorageService.setItem(AUTH_FIRE_KEY, payload);
    })
  );

  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.AUTHENTICATED),
    map((action: userActions.Authenticated) => action.payload),
    concatMap(payload => [new profileActions.SaveLocalProfile(payload)])
  );

  // ************************************************
  // Internal Code
  // ************************************************

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private afs: AngularFirestore,
    private localStorageService: LocalStorageService
  ) {}

  loadProfile(uid: string): Observable<Profile> {
    this.store.dispatch(new profileActions.GetProfile(`/profiles/${uid}`));
    return this.profile$;
  }

  updateProfile(profile: Profile): void {
    this.store.dispatch(new profileActions.UpdateProfile(profile));
  }
}
