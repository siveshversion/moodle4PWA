import { BulkUserRegistrationComponent } from './bulk-user-registration/bulk-user-registration.component';
import { LearnerLPsComponent } from './learner-lps/learner-lps.component';
import { LearnerReportComponent } from './reports/learner-report/learner-report.component';
import { RatingSummaryComponent } from './rating-summary/rating-summary.component';
import { AuthGuard } from './../services/auth.guard';
import { UserDetailedReportComponent } from './reports/user-detailed-report/user-detailed-report.component';
import { UsersReportComponent } from './reports/users-report/users-report.component';
import { CourseDetailedReportComponent } from './reports/course-detailed-report/course-detailed-report.component';
import { CourseReportsComponent } from './reports/course-reports/course-reports.component';
import { BuUsersComponent } from './bu-users/bu-users.component';
import { BuCoursesComponent } from './bu-courses/bu-courses.component';
import { BUsComponent } from './bus/bus.component';
import { CreateBUComponent } from './create-bu/create-bu.component';
import { LpSummaryComponent } from './lp-summary/lp-summary.component';
import { LpUsersComponent } from './lp-users/lp-users.component';
import { LpCoursesComponent } from './lp-courses/lp-courses.component';
import { LPsComponent } from './lps/lps.component';
import { CreateLPComponent } from './create-lp/create-lp.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseSummaryComponent } from './course-summary/course-summary.component';
import { MyCourseStatsComponent } from './widget/my-course-stats/my-course-stats.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CourseManageUsersComponent } from './course-management/course-manage-users/course-manage-users.component';
import { CreateCourseComponent } from './course-management/create-course/create-course.component';
import { CourseListComponent } from './course-management/course-list/course-list.component';
import { CategoryListComponent } from './course-management/category-list/category-list.component';
import { CreateCategoryComponent } from './course-management/create-category/create-category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUsersComponent } from './user-management/add-users/add-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ManageUsersComponent } from './user-management/manage-users/manage-users.component';
import { LpReportComponent } from './reports/lp-report/lp-report.component';
import { BuReportComponent } from './reports/bu-report/bu-report.component';
import { PointsReportComponent } from './reports/points-report/points-report.component';
import { PointsDetailingReportComponent } from './reports/points-detailing-report/points-detailing-report.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: ManageUsersComponent,
      },
      {
        path: 'usercreation',
        component: AddUsersComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'categorycreation',
        component: CreateCategoryComponent,
      },
      {
        path: 'categories',
        component: CategoryListComponent,
      },
      {
        path: 'courses',
        component: CourseListComponent,
      },
      {
        path: 'coursecreation',
        component: CreateCourseComponent,
      },
      {
        path: 'courseparticipants',
        component: CourseManageUsersComponent,
      },
      {
        path: 'mycourses',
        component: MyCoursesComponent,
      },
      {
        path: 'coursestats',
        component: MyCourseStatsComponent,
      },
      {
        path: 'coursesummary',
        component: CourseSummaryComponent,
      },
      {
        path: 'course',
        component: CourseDetailsComponent,
      },
      {
        path: 'create-lp',
        component: CreateLPComponent,
      },
      {
        path: 'lps',
        component: LPsComponent,
      },
      {
        path: 'lp-courses',
        component: LpCoursesComponent,
      },
      {
        path: 'lp-users',
        component: LpUsersComponent,
      },
      {
        path: 'lp-summary',
        component: LpSummaryComponent,
      },
      {
        path: 'create-bu',
        component: CreateBUComponent,
      },
      {
        path: 'bus',
        component: BUsComponent,
      },
      {
        path: 'bu-courses',
        component: BuCoursesComponent,
      },
      {
        path: 'bu-users',
        component: BuUsersComponent,
      },
      {
        path: 'reports/course-report',
        component: CourseReportsComponent,
      },
      {
        path: 'reports/course-detailed-report',
        component: CourseDetailedReportComponent,
      },
      {
        path: 'reports/users-report',
        component: UsersReportComponent,
      },
      {
        path: 'reports/user-detailed-report',
        component: UserDetailedReportComponent,
      },{
        path: 'reports/lp-report',
        component: LpReportComponent,
      } ,{
        path: 'reports/bu-report',
        component: BuReportComponent,
      },{
        path: 'reports/points-report',
        component: PointsReportComponent,
      },{
        path: 'reports/points-detail-report',
        component: PointsDetailingReportComponent,
      },{
        path: 'reports/learner-report',
        component: LearnerReportComponent,
      }, {
        path: 'rating-summary',
        component: RatingSummaryComponent,
      } , {
        path: 'learner-lps',
        component: LearnerLPsComponent,
      }, {
        path: 'bulk-reg-user',
        component: BulkUserRegistrationComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
