import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupLoadCourseImagesPage } from './popup-load-course-images.page';

const routes: Routes = [
  {
    path: '',
    component: PopupLoadCourseImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupLoadCourseImagesPageRoutingModule {}
