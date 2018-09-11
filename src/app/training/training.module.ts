import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training/training.component';
import { CodelabsComponent } from './codelabs/codelabs.component';
import { CoursesComponent } from './courses/courses.component';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TrainingComponent,
    CodelabsComponent,
    CoursesComponent,
    VideosComponent
  ]
})
export class TrainingModule {}
