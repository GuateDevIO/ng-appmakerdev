import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import { Observable, pipe, of, from, defer } from 'rxjs';
import { first, map, filter, catchError, switchMap, tap } from 'rxjs/operators';

import { AppState } from '../core.state';
import { User } from './auth-fire.model';
import { UsersQuery } from './auth-fire.reducer';

import * as userActions from './auth-fire.actions';
type Action = userActions.All;

interface UserProfile {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  organization?: string;
  country?: string;
  provider?: string;
  verified?: boolean;
}

@Injectable()
export class UserFacade {
  // ************************************************
  // Observable Queries available for consumption by views
  // ************************************************
  user$ = this.store.pipe(select(UsersQuery.getUser));

  // ************************************************
  // Effects to be registered at the Module level
  // ************************************************
  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.GET_USER),
    pipe(
      map((action: userActions.GetUser) => action.payload),
      switchMap(payload => this.afAuth.authState),
      // delay(2000)  delay to show loading spinner, delete me!
      map(authData => {
        if (authData) {
          // User logged in
          const user = new User(
            authData.uid,
            authData.displayName,
            authData.photoURL
          );
          return new userActions.Authenticated(user);
        } else {
          // User NOT logged in
          return new userActions.NotAuthenticated();
        }
      }),
      catchError(err => of(new userActions.AuthError()))
    )
  );

  /**
   * Login with Email Address and password
   */
  @Effect()
  loginEmail$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.EMAIL_LOGIN),
    pipe(
      map((action: userActions.EmailLogin) => action.payload),
      switchMap(payload => {
        console.log(
          'loginEmail$ payload: ' + payload.email + ' / ' + payload.password
        );
        return from(this.emailLogin(payload.email, payload.password));
      }),
      map(credential => {
        // successful login
        console.log('Firebase credential: ' + credential.user.uid);
        this.store.dispatch(new userActions.VerifyUser(credential.user.uid));
        return new userActions.GetUser();
      }),
      catchError(err => {
        return of(new userActions.AuthError({ error: err.message }));
      })
    )
  );

  /**
   * Login with Google OAuth
   */
  @Effect()
  loginGoogle$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.GOOGLE_LOGIN),
    pipe(
      map((action: userActions.GoogleLogin) => action.payload),
      switchMap(payload => {
        return from(this.googleLogin());
      }),
      map(credential => {
        // successful login
        console.log('Firebase credential: ' + credential.user.uid);
        this.store.dispatch(new userActions.VerifyUser(credential.user.uid));
        return new userActions.GetUser();
      }),
      catchError(err => {
        console.log('Google Login error');
        return of(new userActions.AuthError({ error: err.message }));
      })
    )
  );

  @Effect()
  verifyUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.VERIFY_USER),
    pipe(
      map((action: userActions.VerifyUser) => action.payload),
      switchMap(payload => {
        console.log('verifyUser$ payload: ' + payload);
        return from(
          this.afs.doc<UserProfile>(`users/${payload}`).valueChanges()
        );
      }),
      map(userData => {
        // successful login
        if (userData) {
          // User is Registered
          console.log('Firebase data: ' + userData.uid);
          return new userActions.LoginSuccess();
        } else {
          // User is NOT Registered
          return new userActions.WelcomeUser();
        }
      }),
      catchError(err => {
        return of(new userActions.AuthError({ error: err.message }));
      })
    )
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.LOGOUT_USER),
    pipe(
      map((action: userActions.LogoutUser) => action.payload),
      switchMap(payload => {
        console.log('Firebase Logout afAuth userAction');
        return of(this.afAuth.auth.signOut());
      }),
      map(authData => {
        return new userActions.LogoutSuccess();
      }),
      catchError(err => of(new userActions.AuthError({ error: err.message })))
    )
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(userActions.LOGIN_SUCCESS),
    tap(() => {
      console.log('loginSuccess$ > user/profile');
      this.router.navigate(['account/reset']);
    })
  );

  @Effect({ dispatch: false })
  logoutSuccess$ = this.actions$.pipe(
    ofType(userActions.LOGOUT_SUCCESS),
    tap(() => {
      console.log('logoutSuccess$ > about/');
      this.router.navigate(['']);
    })
  );

  @Effect({ dispatch: false })
  welcomeUser$ = this.actions$.pipe(
    ofType(userActions.WELCOME_USER),
    tap(() => {
      console.log('welcomeUser$ > redirect');
      this.router.navigate(['account/welcome']);
    })
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
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  loginGoogle(): Observable<User> {
    this.store.dispatch(new userActions.GoogleLogin());
    return this.user$;
  }

  loginEmail(email: string, password: string): Observable<User> {
    const payload = {
      email: email,
      password: password
    };
    this.store.dispatch(new userActions.EmailLogin(payload));
    return this.user$;
  }

  logoutUser(): Observable<User> {
    this.store.dispatch(new userActions.LogoutUser());
    return this.user$;
  }

  // ******************************************
  // Internal Methods
  // ******************************************

  protected emailLogin(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  protected googleLogin(): Promise<any> {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
