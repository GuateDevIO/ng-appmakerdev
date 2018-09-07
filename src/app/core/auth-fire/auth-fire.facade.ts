import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';

import { Observable, pipe, of, from, defer } from 'rxjs';
import { map, filter, catchError, switchMap, tap } from 'rxjs/operators';

import { AppState } from '../core.state';
import { User } from './auth-fire.model';
import { UsersQuery } from './auth-fire.reducer';

import * as userActions from './auth-fire.actions';
type Action = userActions.All;

@Injectable()
export class UserFacade {
  // ************************************************
  // Observable Queries available for consumption by views
  // ************************************************
  user$ = this.store.select(UsersQuery.getUser);

  // ************************************************
  // Effects to be registered at the Module level
  // ************************************************
  @Effect()
  getUser$: Observable<Action> = this.actions$
    .ofType(userActions.GET_USER)
    .pipe(
      map((action: userActions.GetUser) => action.payload),
      switchMap(payload => this.afAuth.authState),
      // delay(2000)  delay to show loading spinner, delete me!
      map(authData => {
        if (authData) {
          // User logged in
          console.log('getUser = Authenticated');
          const user = new User(
            authData.uid,
            authData.displayName,
            authData.photoURL
          );
          // this.router.navigate(['/account/welcome']);
          return new userActions.Authenticated(user);
        } else {
          // User not logged in
          console.log('getUser = NotAuthenticated');
          return new userActions.NotAuthenticated();
        }
      }),
      catchError(err => of(new userActions.AuthError()))
    );

  /**
   * Login with Google OAuth
   */
  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(userActions.GOOGLE_LOGIN)
    .pipe(
      map((action: userActions.GoogleLogin) => action.payload),
      switchMap(payload => {
        return from(this.googleLogin());
      }),
      map(credential => {
        // successful login
        console.log('Google Login successful ' + credential);
        return new userActions.GetUser();
      }),
      catchError(err => {
        console.log('Google Login error');
        return of(new userActions.AuthError({ error: err.message }));
      })
    );

  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(userActions.LOGOUT_FIREBASE)
    .pipe(
      map((action: userActions.LogoutFirebase) => action.payload),
      switchMap(payload => {
        console.log('LogoutFirebase userAction');
        return of(this.afAuth.auth.signOut());
      }),
      map(authData => {
        console.log('LogoutFirebase Success');
        return new userActions.LogoutSuccess();
      }),
      catchError(err => of(new userActions.AuthError({ error: err.message })))
    );

  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => {
    this.store.dispatch(new userActions.GetUser());
    console.log('Effect INIT GetUser');
  });

  // ************************************************
  // Internal Code
  // ************************************************
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  login(): Observable<User> {
    this.store.dispatch(new userActions.GoogleLogin());
    return this.user$;
  }

  logoutFirebase(): Observable<User> {
    this.store.dispatch(new userActions.LogoutFirebase());
    console.log('LogoutFirebase triggered');
    return this.user$;
  }

  // ******************************************
  // Internal Methods
  // ******************************************

  protected googleLogin(): Promise<any> {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  private afterSignIn(message: string): void {
    // Do after login stuff here, such router redirects, toast messages, etc.
    console.log('afterSignIn ' + message);
  }
}
