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
    return this.http.post(this.base_url + '/cm/api/methods.php?methodname=deleteUser', data);
  }

  lc_mod_suspend_user(data: any): Observable<any> {
    data.append('wstoken', environment.MOODLE_TOKEN);
    data.append('wsfunction', 'core_user_update_users');
    return this.http.post(this.base_url + '/cm/api/methods.php?methodname=suspendUser', data);
  }


}
