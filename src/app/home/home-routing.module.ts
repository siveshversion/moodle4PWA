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

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'users',
        component: ManageUsersComponent
      }, {
        path: 'usercreation',
        component: AddUsersComponent
      }, {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: 'categorycreation',
        component: CreateCategoryComponent
      }, {
        path: 'categories',
        component: CategoryListComponent
      }, {
        path: 'courses',
        component: CourseListComponent
      }, {
        path: 'coursecreation',
        component: CreateCourseComponent
      }, {
        path: 'courseparticipants',
        component: CourseManageUsersComponent
      }, {
        path: 'mycourses',
        component: MyCoursesComponent
      }, {
        path: 'coursestats',
        component: MyCourseStatsComponent
      }, {
        path: 'coursesummary',
        component: CourseSummaryComponent
      }, {
        path: 'course',
        component: CourseDetailsComponent
      }, {
        path: 'create-lp',
        component: CreateLPComponent
      }, {
        path: 'lps',
        component: LPsComponent
      }, {
        path: 'lp-courses',
        component: LpCoursesComponent
      }, {
        path: 'lp-users',
        component: LpUsersComponent
      }, {
        path: 'lp-summary',
        component: LpSummaryComponent
      }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
