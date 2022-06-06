/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalApiService {
  base_url = environment.moodle_url + environment.api_path;

  constructor(private http: HttpClient) { }

  login_svc(data: any): Observable<any> {
    const form = new FormData();
    form.append('username', data.username);
    form.append('password', data.password);
    return this.http.post(this.base_url + '?methodname=validateLogin', form);
  }

  mod_get_user_list(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=getUserList', data);
  }

  check_already_taken(data: any): Observable<any> {
    return this.http.post(
      this.base_url + '?methodname=already_taken_validator',
      data
    );
  }

  add_new_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_create_users');
    data.append('creator_id', localStorage.getItem('user_id'));
    return this.http.post(this.base_url + '?methodname=addNewUser', data);
  }

  get_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(this.base_url + '?methodname=getUser', data);
  }

  update_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_update_users');
    return this.http.post(this.base_url + '?methodname=updateUser', data);
  }

  mod_delete_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_delete_users');
    return this.http.post(this.base_url + '?methodname=deleteUser', data);
  }

  mod_suspend_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_update_users');
    return this.http.post(this.base_url + '?methodname=suspendUser', data);
  }

  create_category(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_create_categories');
    return this.http.post(this.base_url + '?methodname=createCategory', data);
  }

  update_category(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_update_categories');
    return this.http.post(this.base_url + '?methodname=updateCategory', data);
  }

  get_category_by_id(data: any): Observable<any> {
    return this.http.post(
      this.base_url + '?methodname=get_category_by_id',
      data
    );
  }

  category_list(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(this.base_url + '?methodname=listCategories', data);
  }

  course_list(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_enrolled_users');
    return this.http.post(this.base_url + '?methodname=listCourses', data);
  }

  course_report(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(this.base_url + '?methodname=courseReport', data);
  }

  user_course_report(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(this.base_url + '?methodname=userCourseReport', data);
  }

  get_course_by_id(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_get_courses');
    return this.http.post(this.base_url + '?methodname=get_course_by_id', data);
  }

  create_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_create_courses');
    return this.http.post(this.base_url + '?methodname=create_course', data);
  }

  update_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_update_courses');
    return this.http.post(this.base_url + '?methodname=update_course', data);
  }

  course_members(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_enrolled_users');
    return this.http.post(this.base_url + '?methodname=getCourseUsers', data);
  }

  course_filtered_members(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_enrolled_users');
    return this.http.post(
      this.base_url + '?methodname=courseDetailedReport',
      data
    );
  }

  unenroll_user_to_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'enrol_manual_unenrol_users');
    return this.http.post(
      this.base_url + '?methodname=unenrollUserToCourse',
      data
    );
  }

  enroll_user_to_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'enrol_manual_enrol_users');
    return this.http.post(
      this.base_url + '?methodname=enrollUserToCourse',
      data
    );
  }

  mod_get_enrol_courses(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_users_courses');
    data.append('userid', localStorage.getItem('user_id'));
    return this.http.post(
      this.base_url + '?methodname=getMyEnrolledCourses',
      data
    );
  }

  mod_get_filtered_courses(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_users_courses');
    data.append('userid', localStorage.getItem('user_id'));
    return this.http.post(
      this.base_url + '?methodname=mod_get_filtered_courses',
      data
    );
  }

  mod_get_course_status_count(): Observable<any> {
    const data = new FormData();
    // data.append('wstoken', localStorage.getItem('user_key'));
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('userid', localStorage.getItem('user_id'));
    data.append('wsfunction', 'core_enrol_get_users_courses');
    return this.http.post(
      this.base_url + '?methodname=getCourseStatusCount',
      data
    );
  }

  mod_get_course_details(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_get_courses_by_field');
    return this.http.post(this.base_url + '?methodname=getCourseDetails', data);
  }

  mod_get_course_content(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_get_courses_by_field');
    return this.http.post(this.base_url + '?methodname=getModuleDetails', data);
  }

  admin_dash_content(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(
      this.base_url + '?methodname=getadminDashStats',
      data
    );
  }

  create_lp(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=createLP', data);
  }

  lp_list(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=listLP', data);
  }

  get_lp_by_id(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=get_lp_by_id', data);
  }

  update_lp(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=update_lp', data);
  }

  lp_courses(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=listLPCourses', data);
  }

  add_course_to_LP(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=AddLPCourse', data);
  }

  remove_course_from_lp(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=removeLPCourse', data);
  }

  mod_get_lp_details(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=getLPDetails', data);
  }

  lp_course_members(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=getLPUsers', data);
  }

  assign_LP_user(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=assignLpUser', data);
  }

  unassign_LP_user(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=UnassignLpUser', data);
  }

  mod_get_enrol_lps(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=getMyEnrolledLPs', data);
  }

  mod_get_my_bus(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=getMyEnrolledBUs', data);
  }

  create_bu(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=createBU', data);
  }

  get_bu_by_id(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=get_bu_by_id', data);
  }

  update_bu(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=updateBU', data);
  }

  bu_list(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=listBU', data);
  }

  bu_courses(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=listBUCourses', data);
  }

  add_course_to_BU(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=AddBUCourse', data);
  }

  remove_course_from_bu(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=removeBUCourse', data);
  }

  bu_users(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=getBUUsers', data);
  }

  assign_BU_manager(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=assignBuManager', data);
  }

  unassign_BU_manager(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=UnassignBuManager', data);
  }

  delete_BU(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=DeleteBu', data);
  }

  lp_course_sorting(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=LpCourseSorting', data);
  }

  lp_generate_get_user_token(data: any): Observable<any> {
    return this.http.post(
      this.base_url + '?methodname=generate_get_user_token',
      data
    );
  }

  user_filtered_courses(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(
      this.base_url + '?methodname=userDetailedReport',
      data
    );
  }

  getUserImg(userid: any): Observable<any> {
    const data = new FormData();
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_get_users_by_field');
    data.append('user_id', userid);
    return this.http.post(this.base_url+'?methodname=getUserDetail', data);
  }

  saveReview(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=saveReview', data);
  }

  getReviews(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getReviewsbyCid', data);
  }

  getMyRating(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getMyRating', data);
  }

  point_list(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getPointsReport', data);
  }

  user_point_filtered_courses(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getPointsDetailReport', data);
  }

  get_leaderboard_points(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getLeaderboardPoints', data);
  }

  get_badges(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getBadges', data);
  }

  get_certs(data: any): Observable<any> {
    return this.http.post(this.base_url+'?methodname=getCerts', data);
  }
}


