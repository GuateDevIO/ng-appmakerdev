import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../core/local-storage/local-storage.service';

import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

@Component({
  selector: 'amds-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  lang: string;

  userProfile = {
    uid: '',
    email: '',
    displayName: '',
    photoUrl: '',
    phoneNumber: '',
    providerId: '',
    verified: false
  };

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private localStorageService: LocalStorageService,
    private form: FormBuilder,
    private userService: UserFacade
  ) {}

  updates = [
    { value: 'freq-0', viewValue: 'Never' },
    { value: 'freq-1', viewValue: 'Daily' },
    { value: 'freq-2', viewValue: 'Weekly' },
    { value: 'freq-3', viewValue: 'Biweekly' },
    { value: 'freq-4', viewValue: 'Monthly' }
  ];

  languages = [
    { value: 'en', viewValue: 'English' },
    { value: 'es', viewValue: 'Spanish' }
  ];

  ngOnInit() {
    const localProfileData = this.localStorageService.getItem('AUTH-FIRE');

    if (localProfileData) {
      console.log('localStorageService > ProfileData: ' + localProfileData);
      const localUserName =
        localProfileData.displayName === 'Unverified User'
          ? 'Unregistered Name'
          : localProfileData.displayName;
      const localUid = localProfileData.uid;
      const localEmail =
        localProfileData.email === 'Unregistered Email'
          ? ''
          : localProfileData.email;
      const localDisplayName =
        localUserName === 'Unregistered Name'
          ? ''
          : localProfileData.displayName;
      const localPhotoUrl = localProfileData.photoUrl;
      const localPhoneNumber =
        localProfileData.phoneNumber === 'Unregistered Phone'
          ? ''
          : localProfileData.phoneNumber;
      const localProviderId = localProfileData.providerId;
      const localVerified = localProfileData.verified;

      this.userProfile = {
        uid: localUid,
        email: localEmail,
        displayName: localDisplayName,
        photoUrl: localPhotoUrl,
        phoneNumber: localPhoneNumber,
        providerId: localProviderId,
        verified: localVerified
      };
    }

    console.log('Current Lang: ' + this.translate.currentLang);
    this.lang = this.translate.currentLang;

    if (this.lang === 'es') {
      this.languages = [
        { value: 'en', viewValue: 'Ingles' },
        { value: 'es', viewValue: 'Español' }
      ];
    }

    this.translate.onLangChange.subscribe((result: string) => {
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
      this.lang = this.translate.currentLang;
    });

    this.firstFormGroup = this.form.group({
      profileName: [this.userProfile.displayName, [Validators.required]],
      profileEmail: [
        this.userProfile.email,
        [Validators.required, Validators.email]
      ],
      profileCompany: [''],
      profileLanguage: [this.lang],
      profileBio: ['']
    });
    this.secondFormGroup = this.form.group({
      profileNotificationEmail: true,
      profileNotificationApps: true,
      profileNotificationTraining: true,
      profileNotificationPromo: false,
      profileNotificationFrequency: ['freq-2'],

      profilePushEnable: false,
      profilePushFreeApp: true,
      profilePushPaidApp: true,
      profilePushCourse: true,
      profilePushVideo: true,
      profilePushCodelab: true
    });
  }

  // First Submit Form handler (Save current profile info to Firestore)
  updateProfileInfo() {
    console.log('submitHandler > ');
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
