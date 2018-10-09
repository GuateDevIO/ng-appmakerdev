import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, pipe, of, from, defer } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  concatMap,
  tap,
  take
} from 'rxjs/operators';

import { AppState } from '../core.state';
import { User } from './auth-fire.model';
import { UsersQuery } from './auth-fire.reducer';

import { Profile } from '../auth-profile/auth-profile.model';
import * as profileActions from '../auth-profile/auth-profile.actions';
import * as userActions from './auth-fire.actions';
type Action = userActions.All;
type ProfileAction = profileActions.AllActions;

export const AUTH_KEY = 'AUTH-FIRE';

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
          const newProviderId = authData.providerData[0].providerId.replace(
            '.com',
            ''
          );
          console.log('getUser$: User is logged in');
          console.log('getUser$: User PROVIDER ID: ' + newProviderId);

          const user = new User(
            authData.uid,
            authData.email || null,
            authData.displayName || null,
            authData.photoURL || 'https://angularfirebase.com/images/logo.png',
            authData.phoneNumber || 'Unregistered Phone',
            newProviderId,
            authData.emailVerified
          );
          return new userActions.Authenticated(user);
        } else {
          console.log('getUser$: User NOT logged in');
          return new userActions.NotAuthenticated();
        }
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
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
        console.log('signUpEmail$ payload email: ' + payload.email);
        return from(this.emailSignUp(payload.email, payload.password));
      }),
      map(credential => {
        console.log('signUpEmail$ success > uid: ' + credential.user.uid);
        console.log(
          'signUpEmail$ CREDENTIAL > providerId: ' + credential.user.providerId
        );

        const payload = {
          uid: credential.user.uid,
          email: credential.user.uid,
          displayName: 'Unregistered Name',
          photoUrl: 'https://angularfirebase.com/images/logo.png',
          phoneNumber: 'Unregistered Phone',
          providerId: 'password',
          verified: false
        };
        return new userActions.NewUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.code }));
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
          uid: credential.user.uid
        };
        return new userActions.VerifyUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.code }));
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
          uid: credential.user.uid
        };
        return new userActions.VerifyUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.code }));
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
          uid: credential.user.uid
        };
        return new userActions.VerifyUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.code }));
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
          uid: credential.user.uid
        };
        return new userActions.VerifyUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.code }));
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
          uid: credential.user.uid
        };
        return new userActions.VerifyUser(payload);
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.code }));
        return caught;
      })
    )
  );

  /**
   * Verify if profile exist in Firestore and REDIRECT USER
   */
  @Effect()
  verifyUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.VERIFY_USER),
    pipe(
      map((action: userActions.VerifyUser) => action.payload),
      switchMap(payload => {
        console.log('verifyUser$ payload uid: ' + payload.uid);
        const uid = payload.uid;
        return from(
          this.afs
            .doc<Profile>(`profiles/${uid}`)
            .valueChanges()
            .pipe(take(1))
        );
      }),
      map(afsData => {
        const afAuthData = this.afAuth.auth.currentUser;
        const uid = afAuthData.uid;
        const email = afAuthData.email || 'Unregistered Email';
        const displayName = afAuthData.displayName || 'Unregistered Name';
        const photoUrl =
          afAuthData.photoURL || 'https://angularfirebase.com/images/logo.png';
        const phoneNumber = afAuthData.phoneNumber || 'Unregistered Phone';
        const providerId = afAuthData.providerData[0].providerId.replace(
          '.com',
          ''
        );
        const isEmailVerified = afAuthData.emailVerified;

        console.log('verifyUser$ CREDENTIAL > providerId: ' + providerId);

        if (afsData) {
          // User is already Registered in Firestore
          const afsProfileData = afsData;
          const afsEmail = afsProfileData.email
            ? afsProfileData.email
            : 'Unregistered Email';
          const afsName = afsProfileData.displayName
            ? afsProfileData.displayName
            : 'Unregistered Name';
          const afsPhotoUrl = afsProfileData.photoUrl
            ? afsProfileData.photoUrl
            : 'https://angularfirebase.com/images/logo.png';
          const afsPhone = afsProfileData.phoneNumber
            ? afsProfileData.phoneNumber
            : 'Unregistered Phone';

          console.log('verifyUser$ afs DATA: TRUE');
          console.log('verifyUser$ afs email: ' + afsEmail);
          console.log('verifyUser$ afs displayName: ' + afsName);
          console.log('verifyUser$ afAuth providerId: ' + providerId);
          console.log('verifyUser$ afAuth isEmailVerified: ' + isEmailVerified);

          const payload = {
            uid: uid,
            email: afsEmail,
            displayName: afsName,
            photoUrl: afsPhotoUrl,
            phoneNumber: afsPhone,
            providerId: providerId,
            verified: isEmailVerified
          };

          return new userActions.LoginUser(payload);
        } else {
          // User is NOT Registered in Firestore
          console.log('verifyUser$ afs: FALSE');
          console.log('verifyUser$ afAuth email: ' + email);
          console.log('verifyUser$ afAuth displayName: ' + displayName);
          console.log('verifyUser$ afAuth providerId: ' + providerId);
          console.log('verifyUser$ afAuth isEmailVerified: ' + isEmailVerified);

          const payload = {
            uid: uid,
            email: email,
            displayName: displayName,
            photoUrl: photoUrl,
            phoneNumber: phoneNumber,
            providerId: providerId,
            verified: isEmailVerified
          };
          return new userActions.NewUser(payload);
        }
      }),
      catchError((err, caught) => {
        this.store.dispatch(new userActions.AuthError({ error: err.message }));
        return caught;
      })
    )
  );

  @Effect()
  loginUser$: Observable<Action | ProfileAction> = this.actions$.pipe(
    ofType(userActions.LOGIN_USER),
    map((action: userActions.LoginUser) => action.payload),
    concatMap(payload => [
      new userActions.LoginSuccess(payload),
      new profileActions.UpdateProfile(payload)
    ])
  );

  @Effect()
  newUser$: Observable<Action | ProfileAction> = this.actions$.pipe(
    ofType(userActions.NEW_USER),
    map((action: userActions.NewUser) => action.payload),
    concatMap(payload => [
      new userActions.WelcomeUser(payload),
      new profileActions.CreateProfile(payload)
    ])
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(userActions.LOGIN_SUCCESS),
    map((action: userActions.LoginSuccess) => action.payload),
    tap(payload => {
      console.log('loginSuccess$ > user/profile [payload.uid]: ' + payload.uid);
      const emailDisplay =
        payload.displayName === 'Unregistered Name'
          ? payload.email
          : payload.displayName;
      const successMsg = this.translateService.instant(
        'amds.auth-fire.signin-success',
        { email: emailDisplay }
      );
      const actionMsg = this.translateService.instant(
        'amds.auth-fire.signin-action'
      );
      this.showNotification(successMsg, actionMsg);
      this.router.navigate(['user/profile']);
    })
  );

  @Effect({ dispatch: false })
  welcomeUser$ = this.actions$.pipe(
    ofType(userActions.WELCOME_USER),
    map((action: userActions.WelcomeUser) => action.payload),
    tap(payload => {
      console.log('welcomeUser$ > user/profile [payload.uid]: ' + payload.uid);
      const isEmailVerified = payload.verified;
      const verifyProvider = payload.providerId === 'password' ? true : false;

      if (!isEmailVerified && verifyProvider) {
        console.log('welcomeUser$ Unverified Email > verification link sent');
        this.sendVerificationLink(payload.email);
      }

      const welcomeMsg = this.translateService.instant(
        'amds.auth-fire.signup-success'
      );
      this.showNotification(welcomeMsg, '');
      this.router.navigate(['account/welcome']);
    })
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
      catchError(err => of(new userActions.AuthError({ error: err.code })))
    )
  );

  @Effect({ dispatch: false })
  logoutSuccess$ = this.actions$.pipe(
    ofType(userActions.LOGOUT_SUCCESS),
    tap(() => {
      console.log('logoutSuccess$ > about/');
      this.showNotification('Logout succesfully', '');
      this.router.navigate(['']);
    })
  );

  @Effect({ dispatch: false })
  authError$ = this.actions$.pipe(
    ofType(userActions.AUTH_ERROR),
    map((action: userActions.AuthError) => action.payload),
    tap(payload => {
      console.log('authError$ ERROR > showNotification');
      this.showNotification('Error occured', 'error', payload.error);
    })
  );

  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => {
    console.log('init$ Effect > GetUser');
    this.store.dispatch(new userActions.GetUser());
  });

  // ************************************************
  // Internal Code
  // ************************************************
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
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

  resetPassRedirect(): void {
    console.log('resetPassRedirect triggered!');
    this.router.navigate(['account/reset']);
  }

  signUpRedirect(): void {
    console.log('signUpRedirect triggered!');
    this.router.navigate(['account/register']);
  }

  loginRedirect(): void {
    console.log('loginRedirect triggered!');
    this.router.navigate(['account/login']);
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

  protected sendVerificationLink(email: string) {
    this.afAuth.auth.currentUser
      .sendEmailVerification()
      .then(function() {
        // Email sent.
        console.log('sendVerificationLink to email: ' + email);
      })
      .catch(function(error) {
        // An error happened.
        console.log('sendVerificationLink failed > email: ' + email);
        console.log('sendVerificationLink error: ' + error);
      });
  }

  private showNotification(
    message: string,
    action?: string,
    messageError?: string
  ) {
    if (!messageError) {
      console.log('showNotification > Type: MESSAGE');

      if (action === 'Update profile' || action === 'Actualizar perfil') {
        this.zone.run(() => {
          this.snackBar
            .open(message, action, {
              duration: 5000,
              panelClass: 'app-notification-overlay'
            })
            .onAction()
            .subscribe(() => this.loginRedirect());
        });
      } else {
        this.zone.run(() => {
          this.snackBar.open(message, action, {
            duration: 5000,
            panelClass: 'app-notification-overlay'
          });
        });
      }
    } else {
      console.log('showNotification > Type: ERROR');

      // ******** EMAIL LOGIN ERROR MESSAGES ********
      if (messageError === 'auth/user-not-found') {
        console.log('authError$: The user does not exist.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-user-not-found'
        );
        const errorAction = this.translateService.instant(
          'amds.auth-fire.action-register-account'
        );
        this.zone.run(() => {
          this.snackBar
            .open(errorMsg, errorAction, {
              duration: 4000,
              panelClass: 'app-notification-overlay'
            })
            .onAction()
            .subscribe(() => this.signUpRedirect());
        });
      } else if (messageError === 'auth/wrong-password') {
        console.log('authError$: Password is invalid or does not exist');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-wrong-pass'
        );
        const errorAction = this.translateService.instant(
          'amds.auth-fire.action-reset-pass'
        );
        this.zone.run(() => {
          this.snackBar
            .open(errorMsg, errorAction, {
              duration: 4000,
              panelClass: 'app-notification-overlay'
            })
            .onAction()
            .subscribe(() => this.resetPassRedirect());
        });
      } else if (messageError === 'auth/user-disabled') {
        console.log('authError$: The Account is disabled.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-user-disabled'
        );
        const errorAction = this.translateService.instant(
          'amds.auth-fire.action-contact-admin'
        );
        this.zone.run(() => {
          this.snackBar
            .open(errorMsg, errorAction, {
              duration: 4000,
              panelClass: 'app-notification-overlay'
            })
            .onAction()
            .subscribe(() => this.resetPassRedirect());
        });
      } else if (messageError === 'auth/email-already-in-use') {
        // ******** EMAIL SIGN UP ERROR MESSAGES ********
        // Note: The other error codes are beomg handled by ANGULAR REACTIVE FORMS.

        console.log('authError$: The user already exist.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-email-already-used'
        );
        const errorAction = this.translateService.instant(
          'amds.auth-fire.action-login-account'
        );
        this.zone.run(() => {
          this.snackBar
            .open(errorMsg, errorAction, {
              duration: 4000,
              panelClass: 'app-notification-overlay'
            })
            .onAction()
            .subscribe(() => this.loginRedirect());
        });
      } else if (
        messageError === 'auth/account-exists-with-different-credential'
      ) {
        // ******** OAUTH WITH POPUP ERROR MESSAGES ********

        console.log('authError$: Credential email already exist.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-credential-exists'
        );
        const errorAction = this.translateService.instant(
          'amds.auth-fire.action-credential-account'
        );
        this.zone.run(() => {
          this.snackBar
            .open(errorMsg, errorAction, {
              duration: 4000,
              panelClass: 'app-notification-overlay'
            })
            .onAction()
            .subscribe(() => this.loginRedirect());
        });
      } else if (messageError === 'auth/popup-closed-by-user') {
        console.log('authError$: OAuth popup CLOSED, try again.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-popup-closed'
        );
        this.zone.run(() => {
          this.snackBar.open(errorMsg, '', {
            duration: 3500,
            panelClass: 'app-notification-overlay'
          });
        });
      } else if (messageError === 'auth/popup-blocked') {
        console.log('authError$: OAuth popup is BLOCKED, try again.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-popup-blocked'
        );
        this.zone.run(() => {
          this.snackBar.open(errorMsg, '', {
            duration: 3500,
            panelClass: 'app-notification-overlay'
          });
        });
      } else if (messageError === 'auth/cancelled-popup-request') {
        console.log('authError$: OAuth popup CANCELLED, try again.');
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-popup-cancelled'
        );
        this.zone.run(() => {
          this.snackBar.open(errorMsg, '', {
            duration: 3500,
            panelClass: 'app-notification-overlay'
          });
        });
      } else {
        console.log('authError$: UNKOWN ERROR: ' + messageError);
        const errorMsg = this.translateService.instant(
          'amds.auth-fire.error-unkown'
        );
        this.zone.run(() => {
          this.snackBar.open(errorMsg, '', {
            duration: 3500,
            panelClass: 'app-notification-overlay'
          });
        });
      }
    }
  }
}
