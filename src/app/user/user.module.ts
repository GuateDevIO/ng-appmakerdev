import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CoursesComponent } from './courses/courses.component';
import { EarningsComponent } from './earnings/earnings.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    UserComponent,
    ProfileComponent,
    NotificationsComponent,
    CoursesComponent,
    EarningsComponent
  ]
})
export class UserModule {}
