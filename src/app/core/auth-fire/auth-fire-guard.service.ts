import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './auth-fire.model';
import { UserFacade } from './auth-fire.facade';

@Injectable()
export class AuthFireGuardService implements CanActivate {
  user$: Observable<User> = this.userService.user$;
  isAuthenticated = false;

  constructor(private userService: UserFacade) {
    this.user$.subscribe(user => {
      console.log('AuthFireGuardService $user ID:' + user.uid);
      if (user.uid !== null) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  canActivate(): boolean {
    return this.isAuthenticated;
  }
}
