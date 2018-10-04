import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { Observable } from 'rxjs';

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

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private form: FormBuilder,
    private userService: UserFacade
  ) {
    translate.onLangChange.subscribe((result: string) => {
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
    });
  }

  updates = [
    { value: 'freq-0', viewValue: 'Never' },
    { value: 'freq-1', viewValue: 'Daily' },
    { value: 'freq-2', viewValue: 'Weekly' },
    { value: 'freq-3', viewValue: 'Biweekly' },
    { value: 'freq-4', viewValue: 'Monthly' }
  ];

  languages = [{ value: 'en', viewValue: '' }, { value: 'es', viewValue: '' }];

  countries = [
    { value: 'us', viewValue: 'United States' },
    { value: 'gt', viewValue: 'Guatemala' }
  ];

  ngOnInit() {
    this.firstFormGroup = this.form.group({
      profileName: ['', [Validators.required]],
      profileEmail: ['', [Validators.required, Validators.email]],
      profileCompany: [''],
      profileLanguage: [''],
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
