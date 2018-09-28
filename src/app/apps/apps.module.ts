import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps/apps.component';
import { StoreComponent } from './store/store.component';
import { ShareComponent } from './share/share.component';

@NgModule({
  imports: [SharedModule, AppsRoutingModule],
  declarations: [AppsComponent, StoreComponent, ShareComponent]
})
export class AppsModule {}
