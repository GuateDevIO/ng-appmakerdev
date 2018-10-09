import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageService } from '../../core/local-storage/local-storage.service';

import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'amds-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  // private watch: Subscription;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  closeEmailCard: boolean;
  lang: string;
  languages: any;
  updates: any;
  enLang = [
    { value: 'en', viewValue: 'English' },
    { value: 'es', viewValue: 'Spanish' }
  ];
  esLang = [
    { value: 'en', viewValue: 'Ingles' },
    { value: 'es', viewValue: 'Español' }
  ];
  enUpdates = [
    { value: 'freq-0', viewValue: 'Never' },
    { value: 'freq-1', viewValue: 'Daily' },
    { value: 'freq-2', viewValue: 'Weekly' },
    { value: 'freq-3', viewValue: 'Biweekly' },
    { value: 'freq-4', viewValue: 'Monthly' }
  ];
  esUpdates = [
    { value: 'freq-0', viewValue: 'Nunca' },
    { value: 'freq-1', viewValue: 'Diario' },
    { value: 'freq-2', viewValue: 'Semanal' },
    { value: 'freq-3', viewValue: 'Quincenal' },
    { value: 'freq-4', viewValue: 'Mensual' }
  ];

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private localStorageService: LocalStorageService,
    private form: FormBuilder,
    private userService: UserFacade
  ) {
    /*
      this.watch = this.user$.subscribe(userData => {
        console.log('watch SUBSCRIPTION' + userData.uid);
        this.profileInfo = userData;
      });
  */
  }

  ngOnInit() {
    this.closeEmailCard = true;
    console.log('Current Lang: ' + this.translate.currentLang);
    this.lang = this.translate.currentLang;
    if (this.lang === 'en') {
      this.languages = this.enLang;
      this.updates = this.enUpdates;
    } else {
      this.languages = this.esLang;
      this.updates = this.esUpdates;
    }

    this.firstFormGroup = this.form.group({
      profileName: ['', [Validators.required]],
      profileEmail: ['', [Validators.email]],
      profilePhone: [''],
      profileCompany: [''],
      profileBio: ['']
    });
    this.secondFormGroup = this.form.group({
      profileNotificationEmail: true,
      profileNotificationApps: true,
      profileNotificationTraining: true,
      profileNotificationPromo: false,
      profileNotificationFrequency: ['freq-2'],
      profileNotificationLang: [this.lang],

      profilePushEnable: false,
      profilePushFreeApp: true,
      profilePushPaidApp: true,
      profilePushCourse: true,
      profilePushVideo: true,
      profilePushCodelab: true
    });

    this.user$ = this.userService.user$.pipe(
      tap(userData => {
        if (userData.uid) {
          if (!userData.verified) {
            this.closeEmailCard = false;
          }

          console.log('this.user$.pipe > tap: ' + userData.uid);
          const user = userData;
          const name = user.displayName ? user.displayName : '';
          const email = user.email ? user.email : '';

          this.firstFormGroup.patchValue({
            profileName: name,
            profileEmail: email
          });
        }
      })
    );

    this.translate.onLangChange.subscribe((result: string) => {
      console.log('onLangChange triggered');

      this.languages = [
        {
          value: 'en',
          viewValue: this.translate.instant('amds.account.welcome.language-en')
        },
        {
          value: 'es',
          viewValue: this.translate.instant('amds.account.welcome.language-es')
        }
      ];
      this.updates = [
        {
          value: 'freq-0',
          viewValue: this.translate.instant(
            'amds.account.welcome.notify-freq-a'
          )
        },
        {
          value: 'freq-1',
          viewValue: this.translate.instant(
            'amds.account.welcome.notify-freq-b'
          )
        },
        {
          value: 'freq-2',
          viewValue: this.translate.instant(
            'amds.account.welcome.notify-freq-c'
          )
        },
        {
          value: 'freq-3',
          viewValue: this.translate.instant(
            'amds.account.welcome.notify-freq-d'
          )
        },
        {
          value: 'freq-4',
          viewValue: this.translate.instant(
            'amds.account.welcome.notify-freq-e'
          )
        }
      ];
    });
  }

  ngOnDestroy() {
    // this.watch.unsubscribe();
  }

  // Second Submit  Form handler (Save current profile preferences to Firestore)
  hideEmailCard() {
    console.log('updateUserPreferences > ');
    this.closeEmailCard = true;
  }

  // First Submit Form handler (Save current profile info to Firestore)
  updateProfileInfo() {
    console.log('submitHandler > ');

    const formEmail = this.firstFormGroup.value.profileEmail;
    const formName = this.firstFormGroup.value.profileName;

    console.log('formEmail: ' + formEmail);
    console.log('formName: ' + formName);
  }

  // Second Submit  Form handler (Save current profile preferences to Firestore)
  updateUserPreferences() {
    console.log('updateUserPreferences > ');
  }

  // Save Default Profile information to Firestore
  useDefaultProfileInfo() {
    console.log('useDefaultProfileInfo success > Profile page');
  }
}
