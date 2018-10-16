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
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  closeEmailCard: boolean;
  localUserData: any;
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
  ) {}

  ngOnInit() {
    // CLOSE / HIDE EMAIL VERIFICATION CARD ON INIT
    this.closeEmailCard = true;

    // GET CURRECT SELECTED LANGUAGE AND UPDATE DISPLAY VALUES
    this.lang = this.translate.currentLang ? this.translate.currentLang : 'en';
    console.log('Current Lang: ' + this.lang);

    if (this.lang === 'en') {
      this.languages = this.enLang;
      this.updates = this.enUpdates;
    } else {
      this.languages = this.esLang;
      this.updates = this.esUpdates;
    }

    // SET FORM INITIAL VALUES
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
      profilePushFreeApp: false,
      profilePushPaidApp: false,
      profilePushCourse: false,
      profilePushVideo: false
    });

    this.user$ = this.userService.user$.pipe(
      tap(userData => {
        if (userData.uid) {
          console.log('this.user$.pipe > tap SUCCESS > uid: ' + userData.uid);

          const userAuthData = userData;
          const isEmailProvider =
            userAuthData.providerId === 'password' ? true : false;
          const isUserVerified = userAuthData.verified;
          const userName = userAuthData.displayName
            ? userAuthData.displayName
            : '';
          const userEmail = userAuthData.email ? userAuthData.email : '';

          if (!isEmailProvider) {
            this.firstFormGroup.patchValue({
              profileName: userName,
              profileEmail: userEmail
            });
          }

          if (!isUserVerified && isEmailProvider) {
            this.closeEmailCard = false;
          }

          if (isEmailProvider) {
            const isNameUnregistered =
              userAuthData.displayName === 'Unregistered Name' ? true : false;

            if (!isNameUnregistered) {
              this.firstFormGroup.patchValue({
                profileName: userName,
                profileEmail: userEmail
              });
            } else {
              console.log('THE USER DISPLAY NAME IS NOT REGISTERED YET');

              // GET LOCAL STORAGE DATA IN ORDER TO UPDATE EMAIL NAME
              const localUserData = this.localStorageService.getItem(
                'AUTH-FIRE'
              );

              if (localUserData) {
                console.log('ngOnInit() Local USER Data EXIST');
                const localDisplayName = localUserData.displayName;

                this.firstFormGroup.patchValue({
                  profileName: localDisplayName,
                  profileEmail: userEmail
                });
              } else {
                // Update the email address ONLY
                console.log('ngOnInit() Local USER Data does NOT EXIST');
                this.firstFormGroup.patchValue({
                  profileEmail: userEmail
                });
              }
            }
          }
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
    console.log('ngOnDestroy');
  }

  hideEmailCard() {
    console.log('hideEmailCard > ');
    this.closeEmailCard = true;
  }

  // First Submit Form handler (Save current profile info to Firestore)
  updateProfileInfo() {
    console.log('updateProfileInfo > ');
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
    console.log('useDefaultProfileInfo > user/home');
    this.router.navigate(['user/home']);
  }

  redirectDashboard() {
    this.router.navigate(['user/home']);
  }

  redirectProfile() {
    this.router.navigate(['user/profile']);
  }

  redirectCourses() {
    this.router.navigate(['user/courses']);
  }

  redirectApps() {
    this.router.navigate(['user/earnings']);
  }
}
