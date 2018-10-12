import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

import { routeAnimations, TitleService } from '@app/core';
import { selectSettings, SettingsState } from '@app/settings';
import { AppState } from '@app/core';

import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

@Component({
  selector: 'amds-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [routeAnimations]
})
export class UserComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  users = [
    { link: 'home', label: 'amds.user.menu.home', auth: false },
    { link: 'profile', label: 'amds.user.menu.profile', auth: true },
    {
      link: 'notifications',
      label: 'amds.user.menu.notifications',
      auth: true
    },
    { link: 'courses', label: 'amds.user.menu.courses', auth: true },
    { link: 'earnings', label: 'amds.user.menu.earnings', auth: true }
  ];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private titleService: TitleService,
    private translate: TranslateService,
    private userService: UserFacade
  ) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.subscribeToSettings();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToSettings() {
    this.store
      .pipe(select(selectSettings), takeUntil(this.unsubscribe$))
      .subscribe((settings: SettingsState) =>
        this.translate.use(settings.language)
      );
  }

  private subscribeToRouterEvents() {
    this.titleService.setTitle(
      this.router.routerState.snapshot.root,
      this.translate
    );
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        map((event: ActivationEnd) => event.snapshot),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(snapshot =>
        this.titleService.setTitle(snapshot, this.translate)
      );
  }
}
