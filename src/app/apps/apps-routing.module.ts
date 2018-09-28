import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsComponent } from './apps/apps.component';
import { StoreComponent } from './store/store.component';
import { ShareComponent } from './share/share.component';

const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    children: [
      {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full'
      },
      {
        path: 'store',
        component: StoreComponent
      },
      {
        path: 'share',
        component: ShareComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule {}
