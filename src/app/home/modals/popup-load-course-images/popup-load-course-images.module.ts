import { HomePageModule } from './../../home.module';
import { FixUrlPipe } from './../../../fix-url.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopupLoadCourseImagesPageRoutingModule } from './popup-load-course-images-routing.module';

import { PopupLoadCourseImagesPage } from './popup-load-course-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopupLoadCourseImagesPageRoutingModule,
    HomePageModule
  ],
  declarations: [PopupLoadCourseImagesPage]
})
export class PopupLoadCourseImagesPageModule {}
