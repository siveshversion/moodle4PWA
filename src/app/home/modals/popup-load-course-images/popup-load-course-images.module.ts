import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopupLoadCourseImagesPageRoutingModule } from './popup-load-course-images-routing.module';

import { PopupLoadCourseImagesPage } from './popup-load-course-images.page';
import { FixUrlPipeModule } from 'src/app/pipes/fix-url-pipe/fix-url-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FixUrlPipeModule,
    FormsModule,
    IonicModule,
    PopupLoadCourseImagesPageRoutingModule,
  ],
  declarations: [PopupLoadCourseImagesPage],
})
export class PopupLoadCourseImagesPageModule {}
