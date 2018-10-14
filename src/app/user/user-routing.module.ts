import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthFireGuardService } from '@app/core';

import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CoursesComponent } from './courses/courses.component';
import { EarningsComponent } from './earnings/earnings.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'amds.user.menu.home' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'amds.user.menu.profile' }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthFireGuardService],
        data: { title: 'amds.user.menu.notifications' }
      },
      {
        path: 'courses',
        component: CoursesComponent,
        canActivate: [AuthFireGuardService],
        data: { title: 'amds.user.menu.courses' }
      },
      {
        path: 'earnings',
        component: EarningsComponent,
        canActivate: [AuthFireGuardService],
        data: { title: 'amds.user.menu.earnings' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
