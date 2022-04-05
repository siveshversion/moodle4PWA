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
      },{
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
      } ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
