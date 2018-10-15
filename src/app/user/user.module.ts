import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '@app/shared';
import { environment } from '@env/environment';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CoursesComponent } from './courses/courses.component';
import { EarningsComponent } from './earnings/earnings.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  declarations: [
    UserComponent,
    ProfileComponent,
    NotificationsComponent,
    CoursesComponent,
    EarningsComponent,
    HomeComponent
  ]
})
export class UserModule {
  constructor() {}
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/user/`,
    '.json'
  );
}
