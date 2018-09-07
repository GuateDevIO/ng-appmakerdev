import browser from 'browser-detect';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Register & sanitize SVG icons
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

// User Facade for Firebase authentication
import { User } from './core/auth-fire/auth-fire.model';
import { UserFacade } from './core/auth-fire/auth-fire.facade';

import {
  ActionAuthLogin,
  ActionAuthLogout,
  AnimationsService,
  TitleService,
  selectAuth,
  routeAnimations,
  AppState
} from '@app/core';
import { environment as env } from '@env/environment';

import {
  NIGHT_MODE_THEME,
  selectSettings,
  SettingsState,
  ActionSettingsPersist,
  ActionSettingsChangeLanguage,
  ActionSettingsChangeAnimationsPageDisabled
} from './settings';

@Component({
  selector: 'amds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  @HostBinding('class') componentCssClass;

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../assets/logo.png');
  languages = ['en', 'es'];
  navigation = [
    { link: 'about', label: 'amds.menu.about' },
    { link: 'features', label: 'amds.menu.features' },
    { link: 'examples', label: 'amds.menu.examples' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'amds.menu.settings' }
  ];

  settings: SettingsState;
  isAuthenticated: boolean;
  userPhotoUrl: any;

  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<AppState>,
    private router: Router,
    private titleService: TitleService,
    private animationService: AnimationsService,
    private translate: TranslateService,
    private userService: UserFacade,
    private sanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry
  ) {
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
  }

  private static trackPageView(event: NavigationEnd) {
    (<any>window).gtag('set', 'page', event.urlAfterRedirects);
    (<any>window).gtag('send', 'pageview');
  }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    // Subscribe to User facade authentication
    this.user$.subscribe(user => {
      console.log('ngOnInit User ID:' + user.uid);

      if (user.uid !== null) {
        this.userPhotoUrl = this.sanitizer.bypassSecurityTrustStyle(
          `url(${user.photoUrl}) no-repeat center center/40px 40px`
        );
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });

    // this.subscribeToIsAuthenticated();
    this.translate.setDefaultLang('en');
    this.subscribeToSettings();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoginClick() {
    // this.store.dispatch(new ActionAuthLogin());
    this.router.navigate(['account/login']);
  }

  onLogoutClick() {
    // this.store.dispatch(new ActionAuthLogout());
    this.userService.logoutFirebase();
    this.router.navigate(['/about']);
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(new ActionSettingsChangeLanguage({ language }));
    this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
  }

  private subscribeToIsAuthenticated() {
    this.store
      .pipe(select(selectAuth), takeUntil(this.unsubscribe$))
      .subscribe(auth => (this.isAuthenticated = auth.isAuthenticated));
  }

  private subscribeToSettings() {
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        new ActionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }
    this.store
      .pipe(select(selectSettings), takeUntil(this.unsubscribe$))
      .subscribe(settings => {
        this.settings = settings;
        this.setTheme(settings);
        this.setLanguage(settings);
        this.animationService.updateRouteAnimationType(
          settings.pageAnimations,
          settings.elementsAnimations
        );
      });
  }

  private setTheme(settings: SettingsState) {
    const { theme, autoNightMode } = settings;
    const hours = new Date().getHours();
    const effectiveTheme = (autoNightMode && (hours >= 20 || hours <= 6)
      ? NIGHT_MODE_THEME
      : theme
    ).toLowerCase();
    this.componentCssClass = effectiveTheme;
    const classList = this.overlayContainer.getContainerElement().classList;
    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(effectiveTheme);
  }

  private setLanguage(settings: SettingsState) {
    const { language } = settings;
    if (language) {
      this.translate.use(language);
    }
  }

  private subscribeToRouterEvents() {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.titleService.setTitle(event.snapshot);
      }

      if (event instanceof NavigationEnd) {
        AppComponent.trackPageView(event);
      }
    });
  }
}
