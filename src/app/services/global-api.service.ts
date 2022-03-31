import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {

  constructor(private http: HttpClient) { }

  lc_login_svc(data: any): Observable<any> {
    const form = new FormData;
    form.append('username', data.username);
    form.append('password', data.password);
    return this.http.post(environment.lc_moodle_url + '/cm/api/methods.php?methodname=validateLogin', form);
  }

  lc_mod_get_user_list(data: any): Observable<any> {
    let base_url = environment.lc_moodle_url;
    return this.http.post(base_url + '/cm/api/methods.php?methodname=getUserList', data);
  }





}
