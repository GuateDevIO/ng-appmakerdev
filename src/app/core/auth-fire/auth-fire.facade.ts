import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, pipe, of, from, defer } from 'rxjs';
import {
  first,
  map,
  filter,
  catchError,
  switchMap,
  mergeMap,
  tap,
  take
} from 'rxjs/operators';

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

interface UserUpdate {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  provider?: string;
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
      map(authData => {
        if (authData) {
          console.log('getUser$: User logged in');
          const user = new User(
            authData.uid,
            authData.displayName,
            authData.photoURL
          );
          return new userActions.Authenticated(user);
        } else {
          console.log('getUser$: User NOT logged in');
          return new userActions.NotAuthenticated();
        }
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError());
        return caught;
      })
    )
  );

  /**
   * Sign Up with Email Address and password
   */
  @Effect()
  signUpEmail$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.EMAIL_SIGN_UP),
    pipe(
      map((action: userActions.EmailSignUp) => action.payload),
      switchMap(payload => {
        console.log('signUpEmail$ payload: ' + payload.email);
        return from(this.emailSignUp(payload.email, payload.password));
      }),
      map(credential => {
        console.log('signUpEmail$ success > uid: ' + credential.user.uid);
        credential.user.updateProfile({
          displayName: 'nameless email user',
          photoURL: 'https://goo.gl/Fz9nrQ'
        });
        const payload = {
          uid: credential.user.uid,
          email: credential.user.email,
          photoURL: 'https://goo.gl/Fz9nrQ',
          displayName: 'nameless email user',
          provider: 'email',
          verified: false
        };
        this.store.dispatch(new userActions.GetUser());
        return new userActions.UpdateUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
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
        console.log('loginEmail$ payload: ' + payload.email);
        return from(this.emailLogin(payload.email, payload.password));
      }),
      map(credential => {
        console.log('loginEmail$ success > uid: ' + credential.user.uid);
        const payload = {
          uid: credential.user.uid,
          email: credential.user.email,
          photoURL: credential.user.photoURL || 'https://goo.gl/Fz9nrQ',
          displayName: credential.user.displayName || 'nameless email',
          provider: 'email'
        };
        this.store.dispatch(new userActions.GetUser());
        return new userActions.UpdateUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
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
        console.log('loginGoogle$ success > uid: ' + credential.user.uid);
        const payload = {
          uid: credential.user.uid,
          email: credential.user.email || null,
          photoURL: credential.user.photoURL || 'https://goo.gl/Fz9nrQ',
          displayName: credential.user.displayName || 'nameless google',
          provider: 'google'
        };
        this.store.dispatch(new userActions.GetUser());
        return new userActions.UpdateUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  /**
   * Login with Facebook OAuth
   */
  @Effect()
  loginFacebook$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.FACEBOOK_LOGIN),
    pipe(
      map((action: userActions.FacebookLogin) => action.payload),
      switchMap(payload => {
        return from(this.facebookLogin());
      }),
      map(credential => {
        console.log('loginFacebook$ success > uid: ' + credential.user.uid);
        const payload = {
          uid: credential.user.uid,
          email: credential.user.email || null,
          photoURL: credential.user.photoURL || 'https://goo.gl/Fz9nrQ',
          displayName: credential.user.displayName || 'nameless facebook',
          provider: 'facebook'
        };
        this.store.dispatch(new userActions.GetUser());
        return new userActions.UpdateUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  /**
   * Login with Twitter OAuth
   */
  @Effect()
  loginTwitter$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.TWITTER_LOGIN),
    pipe(
      map((action: userActions.TwitterLogin) => action.payload),
      switchMap(payload => {
        return from(this.twitterLogin());
      }),
      map(credential => {
        console.log('loginTwitter$ success > uid: ' + credential.user.uid);
        const payload = {
          uid: credential.user.uid,
          email: credential.user.email || null,
          photoURL: credential.user.photoURL || 'https://goo.gl/Fz9nrQ',
          displayName: credential.user.displayName || 'nameless twitter',
          provider: 'twitter'
        };
        this.store.dispatch(new userActions.GetUser());
        return new userActions.UpdateUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  /**
   * Login with Twitter OAuth
   */
  @Effect()
  loginGithub$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.GITHUB_LOGIN),
    pipe(
      map((action: userActions.GithubLogin) => action.payload),
      switchMap(payload => {
        return from(this.githubLogin());
      }),
      map(credential => {
        console.log('loginGithub$ success > uid: ' + credential.user.uid);
        const payload = {
          uid: credential.user.uid,
          email: credential.user.email || null,
          photoURL: credential.user.photoURL || 'https://goo.gl/Fz9nrQ',
          displayName: credential.user.displayName || 'nameless github',
          provider: 'github'
        };
        this.store.dispatch(new userActions.GetUser());
        return new userActions.UpdateUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  /**
   * Update user profile information in Firestore
   */
  @Effect()
  updateUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.UPDATE_USER),
    pipe(
      map((action: userActions.UpdateUser) => action.payload),
      switchMap(payload => {
        const userRef: AngularFirestoreDocument<UserUpdate> = this.afs.doc(
          `users/${payload.uid}`
        );
        console.log('updateUser$ Firestore write > uid: ' + payload.uid);
        return of(userRef.set(payload, { merge: true }));
      }),
      map(authData => {
        authData.then(() => {
          console.log('updateUser$ Doc successfully written! > VerifyUser');
          this.store.dispatch(new userActions.VerifyUser());
        });
        return new userActions.UpdateSuccess();
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  @Effect()
  verifyUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.VERIFY_USER),
    pipe(
      map((action: userActions.VerifyUser) => action.payload),
      switchMap(payload => {
        const uid = this.afAuth.auth.currentUser.uid;
        console.log('verifyUser$ CHECK Firebase uid: ' + uid);
        return from(
          this.afs
            .doc<UserProfile>(`users/${uid}`)
            .valueChanges()
            .pipe(take(1))
        );
      }),
      map(authData => {
        console.log('verifyUser$ Firebase uid: ' + authData.uid);
        console.log('verifyUser$ Firebase email: ' + authData.email);
        console.log(
          'verifyUser$ Firebase displayName: ' + authData.displayName
        );
        console.log('verifyUser$ Firebase provider: ' + authData.provider);
        console.log('verifyUser$ Firebase verified: ' + authData.verified);

        if (authData.verified) {
          console.log('verifyUser$ authData.verified: TRUE');

          const userProvider = authData.provider;

          if (userProvider === 'email') {
            console.log('verifyUser$ provider: ' + userProvider);
          }
          return new userActions.LoginSuccess();
        } else {
          // User is NOT Registered in Firestore
          console.log('verifyUser$ authData.verified: FALSE');
          return new userActions.WelcomeUser();
        }
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.LOGOUT_USER),
    pipe(
      map((action: userActions.LogoutUser) => action.payload),
      switchMap(payload => {
        console.log('logout$ afAuth userAction');
        return of(this.afAuth.auth.signOut());
      }),
      map(authData => {
        return new userActions.LogoutSuccess();
      }),
      catchError(err => of(new userActions.AuthError({ error: err.message })))
    )
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType(userActions.UPDATE_SUCCESS),
    tap(() => {
      console.log('updateSuccess$ > action completed!');
    })
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(userActions.LOGIN_SUCCESS),
    tap(() => {
      console.log('loginSuccess$ > user/profile');
      this.snackBar.open('Login successfull', 'Logout', {
        duration: 2500
      });
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
      console.log('welcomeUser$ > account/welcome');
      this.snackBar.open('Welcome App Maker Dev', 'Update Profile', {
        duration: 2500
      });
      this.router.navigate(['account/welcome']);
    })
  );

  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => {
    console.log('init$ Effect GetUser');
    this.store.dispatch(new userActions.GetUser());
  });

  // ************************************************
  // Internal Code
  // ************************************************
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  signUpEmail(email: string, password: string): Observable<User> {
    const payload = {
      email: email,
      password: password
    };
    this.store.dispatch(new userActions.EmailSignUp(payload));
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

  loginGoogle(): Observable<User> {
    this.store.dispatch(new userActions.GoogleLogin());
    return this.user$;
  }

  loginFacebook(): Observable<User> {
    this.store.dispatch(new userActions.FacebookLogin());
    return this.user$;
  }

  loginTwitter(): Observable<User> {
    this.store.dispatch(new userActions.TwitterLogin());
    return this.user$;
  }

  loginGithub(): Observable<User> {
    this.store.dispatch(new userActions.GithubLogin());
    return this.user$;
  }

  logoutUser(): Observable<User> {
    this.store.dispatch(new userActions.LogoutUser());
    return this.user$;
  }

  // ******************************************
  // Internal Methods
  // ******************************************

  protected emailSignUp(email: string, password: string): Promise<any> {
    const newEmail = email;
    const newPass = password;
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPass);
  }

  protected emailLogin(email: string, password: string): Promise<any> {
    const newEmail = email;
    const newPass = password;
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPass);
  }

  protected googleLogin(): Promise<any> {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  protected facebookLogin(): Promise<any> {
    const provider = new auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  protected twitterLogin(): Promise<any> {
    const provider = new auth.TwitterAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  protected githubLogin(): Promise<any> {
    const provider = new auth.GithubAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
