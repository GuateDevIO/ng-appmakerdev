import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

@Component({
  selector: 'amds-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  show: boolean = true;

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  constructor(
    private router: Router,
    public translate: TranslateService,
    private userService: UserFacade
  ) {}

  ngOnInit() {}
}
