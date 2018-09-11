import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsComponent } from './apps/apps.component';
import { StoreComponent } from './store/store.component';
import { ShareComponent } from './share/share.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AppsComponent, StoreComponent, ShareComponent]
})
export class AppsModule {}
