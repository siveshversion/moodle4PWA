import { LPsComponent } from './lps/lps.component';
import { CreateLPComponent } from './create-lp/create-lp.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseSummaryComponent } from './course-summary/course-summary.component';
import { MyCourseStatsComponent } from './widget/my-course-stats/my-course-stats.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CreateCourseComponent } from './course-management/create-course/create-course.component';
import { CourseListComponent } from './course-management/course-list/course-list.component';
import { CategoryListComponent } from './course-management/category-list/category-list.component';
import { CreateCategoryComponent } from './course-management/create-category/create-category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { GlobalApiService } from '../services/global-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ManageUsersComponent } from './user-management/manage-users/manage-users.component';
import { AddUsersComponent } from './user-management/add-users/add-users.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CourseManageUsersComponent } from './course-management/course-manage-users/course-manage-users.component';
import { CountUpModule } from 'ngx-countup';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicStorageModule.forRoot(),
    HomePageRoutingModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatPaginatorModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatTableModule,
    CountUpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [HomePage, ManageUsersComponent, AddUsersComponent, DashboardComponent, CreateCategoryComponent, CategoryListComponent, CourseListComponent, CreateCourseComponent, CourseManageUsersComponent, MyCoursesComponent, MyCourseStatsComponent, CourseSummaryComponent, CourseDetailsComponent, CreateLPComponent, LPsComponent],
  providers: [GlobalApiService, HttpClient, Storage]
})
export class HomePageModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}