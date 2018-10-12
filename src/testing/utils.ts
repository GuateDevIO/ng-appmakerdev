import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {
  Store,
  StateObservable,
  ActionsSubject,
  ReducerManager,
  StoreModule
} from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UserFacade } from '../app/core/auth-fire/auth-fire.facade';
import { ProfileFacade } from '../app/core/auth-profile/auth-profile.facade';

import { environment } from '../environments/environment';

// Register & sanitize SVG icons
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Injectable()
export class MockStore<T> extends Store<T> {
  private stateSubject = new BehaviorSubject<T>({} as T);

  constructor(
    state$: StateObservable,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager
  ) {
    super(state$, actionsObserver, reducerManager);
    this.source = this.stateSubject.asObservable();
  }

  setState(nextState: T) {
    this.stateSubject.next(nextState);
  }
}

export function provideMockStore() {
  return {
    provide: Store,
    useClass: MockStore
  };
}

@NgModule({
  imports: [
    NoopAnimationsModule,
    RouterTestingModule,
    SharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(
      environment.firebaseConfig,
      'app-maker-developers'
    ),
    AngularFireAuthModule,
    AngularFirestoreModule,
    TranslateModule.forRoot(),
    StoreModule.forRoot({})
  ],
  exports: [
    NoopAnimationsModule,
    RouterTestingModule,
    SharedModule,
    TranslateModule
  ],
  providers: [provideMockStore(), UserFacade, ProfileFacade]
})
export class TestingModule {
  constructor(sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {
    iconRegistry.addSvgIcon(
      'google-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/google.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'facebook-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/facebook.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'twitter-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/twitter.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'github-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/github.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'mail-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/mail.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'phone-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/phone.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'youtube-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/youtube.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'medium-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/medium.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'instagram-ic',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/social-icons/instagram.svg'
      )
    );
  }
}
