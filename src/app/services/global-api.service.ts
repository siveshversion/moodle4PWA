import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {

  base_url = environment.lc_moodle_url + environment.api_path;

  constructor(private http: HttpClient) { }

  lc_login_svc(data: any): Observable<any> {
    const form = new FormData;
    form.append('username', data.username);
    form.append('password', data.password);
    return this.http.post(this.base_url + '?methodname=validateLogin', form);
  }

  lc_mod_get_user_list(data: any): Observable<any> {

    return this.http.post(this.base_url + '?methodname=getUserList', data);
  }

  lc_check_already_taken(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=already_taken_validator', data);
  }

  lc_add_new_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_create_users');
    data.append('creator_id', localStorage.getItem('user_id'));
    return this.http.post(this.base_url + '?methodname=addNewUser', data);
  }

  lc_get_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(this.base_url + '?methodname=getUser', data);
  }

  lc_update_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_update_users');
    return this.http.post(this.base_url + '?methodname=updateUser', data);
  }

  lc_mod_delete_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_delete_users');
    return this.http.post(this.base_url + '?methodname=deleteUser', data);
  }

  lc_mod_suspend_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_update_users');
    return this.http.post(this.base_url + '?methodname=suspendUser', data);
  }

  lc_create_category(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_create_categories');
    return this.http.post(this.base_url + '?methodname=createCategory', data);
  }

  lc_update_category(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_update_categories');
    return this.http.post(this.base_url + '?methodname=updateCategory', data);
  }

  lc_get_category_by_id(data: any): Observable<any> {
    return this.http.post(this.base_url + '?methodname=get_category_by_id', data);
  }

  lc_category_list(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    return this.http.post(this.base_url + '?methodname=listCategories', data);
  }

  lc_course_list(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_enrolled_users');
    return this.http.post(this.base_url + '?methodname=listCourses', data);
  }
  6
  lc_get_course_by_id(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_get_courses');
    return this.http.post(this.base_url + '?methodname=get_course_by_id', data);
  }

  lc_create_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_create_courses');
    return this.http.post(this.base_url + '?methodname=create_course', data);
  }

  lc_update_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_course_update_courses');
    return this.http.post(this.base_url + '?methodname=update_course', data);
  }

  lc_course_members(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_enrolled_users');
    return this.http.post(this.base_url + '?methodname=getCourseUsers', data);
  }

  lc_unenroll_user_to_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'enrol_manual_unenrol_users');
    return this.http.post(this.base_url + '?methodname=unenrollUserToCourse', data);
  }

  lc_enroll_user_to_course(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'enrol_manual_enrol_users');
    return this.http.post(this.base_url + '?methodname=enrollUserToCourse', data);
  }

  lc_mod_get_enrol_courses(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_enrol_get_users_courses');
    return this.http.post(this.base_url + '?methodname=getMyEnrolledCourses', data);
  }

  lc_mod_get_course_status_count(): Observable<any> {
    const data = new FormData();
    // data.append('wstoken', localStorage.getItem('user_key'));
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('userid', localStorage.getItem('user_id'));
    data.append('wsfunction', 'core_enrol_get_users_courses');
    return this.http.post(this.base_url + '?methodname=getCourseStatusCount', data);
  }

}
