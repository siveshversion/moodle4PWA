import { LpCoursesReportComponent } from './reports/lp-courses-report/lp-courses-report.component';
import { MoodleLoadComponent } from './moodle-load/moodle-load.component';
import { MoodleViewComponent } from './moodle-view/moodle-view.component';
import { CatalogComponent } from './catalog/catalog.component';
import { AvailcoursesComponent } from './availcourses/availcourses.component';
import { BulkUserRegistrationComponent } from './bulk-user-registration/bulk-user-registration.component';
import { LearnerLPsComponent } from './learner-lps/learner-lps.component';
import { LearnerReportComponent } from './reports/learner-report/learner-report.component';
import { BuAdminDashComponent } from './bu-admin-dash/bu-admin-dash.component';
import { LoaderService } from './../services/loader.service';
import { PointsDetailingReportComponent } from './reports/points-detailing-report/points-detailing-report.component';
import { PointsReportComponent } from './reports/points-report/points-report.component';
import { PointsComponent } from './learnerWidgets/points/points.component';
import { BadgesComponent } from './learnerWidgets/badges/badges.component';
import { CertsComponent } from './learnerWidgets/certs/certs.component';
import { RatingSummaryComponent } from './rating-summary/rating-summary.component';
import { BuReportComponent } from './reports/bu-report/bu-report.component';
import { UserDetailedReportComponent } from './reports/user-detailed-report/user-detailed-report.component';
import { UsersReportComponent } from './reports/users-report/users-report.component';
import { CourseDetailedReportComponent } from './reports/course-detailed-report/course-detailed-report.component';
import { CourseReportsComponent } from './reports/course-reports/course-reports.component';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
import { BUsComponent } from './bus/bus.component';
import { CreateBUComponent } from './create-bu/create-bu.component';
import { LpSummaryComponent } from './lp-summary/lp-summary.component';
import { LpUsersComponent } from './lp-users/lp-users.component';
import { LpCoursesComponent } from './lp-courses/lp-courses.component';
import { LPsComponent } from './lps/lps.component';
import { CreateLPComponent } from './create-lp/create-lp.component';
import { CourseSummaryComponent } from './course-summary/course-summary.component';
import { MyCourseStatsComponent } from './widget/my-course-stats/my-course-stats.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CreateCourseComponent } from './course-management/create-course/create-course.component';
import { CourseListComponent } from './course-management/course-list/course-list.component';
import { CategoryListComponent } from './course-management/category-list/category-list.component';
import { CreateCategoryComponent } from './course-management/create-category/create-category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
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
import { MatSidenavModule } from '@angular/material/sidenav';
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
import { BuCoursesComponent } from './bu-courses/bu-courses.component';
import { BuUsersComponent } from './bu-users/bu-users.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LpReportComponent } from './reports/lp-report/lp-report.component';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FixUrlPipeModule } from '../pipes/fix-url-pipe/fix-url-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FixUrlPipeModule,
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
    DragDropModule,
    NgxMaterialRatingModule,
    MatSlideToggleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    HomePage,
    ManageUsersComponent,
    AddUsersComponent,
    DashboardComponent,
    CreateCategoryComponent,
    CategoryListComponent,
    CourseListComponent,
    CreateCourseComponent,
    CourseManageUsersComponent,
    MyCoursesComponent,
    MyCourseStatsComponent,
    CourseSummaryComponent,
    CreateLPComponent,
    LPsComponent,
    LpCoursesComponent,
    LpUsersComponent,
    LpSummaryComponent,
    CreateBUComponent,
    BUsComponent,
    BuCoursesComponent,
    BuUsersComponent,
    CourseReportsComponent,
    CourseDetailedReportComponent,
    UsersReportComponent,
    UserDetailedReportComponent,
    LpReportComponent,
    BuReportComponent,
    RatingSummaryComponent,
    CertsComponent,
    BadgesComponent,
    PointsComponent,
    PointsReportComponent,
    PointsDetailingReportComponent,
    BuAdminDashComponent,
    LearnerReportComponent,
    LearnerLPsComponent,
    BulkUserRegistrationComponent,
    AvailcoursesComponent,
    CatalogComponent,
    MoodleViewComponent,
    MoodleLoadComponent,
    LpCoursesReportComponent
  ],
  providers: [GlobalApiService, HttpClient, Storage, LoaderService],
})
export class HomePageModule {}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
