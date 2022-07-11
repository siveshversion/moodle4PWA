/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-moodle-view',
  templateUrl: './moodle-view.component.html',
  styleUrls: ['./moodle-view.component.scss'],
})
export class MoodleViewComponent implements OnInit {
  token: any;

  constructor(
    private service: GlobalApiService,
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.router.queryParams.subscribe((params) => {
      this.generate_token(params);
    });
  }

  generate_token(params) {
    const data = new FormData();
    data.append('username', localStorage.getItem('username'));
    data.append('password', localStorage.getItem('password'));

    this.service.lp_generate_get_user_token(data).subscribe((res) => {
      this.token = res.Data.token;
      localStorage.setItem('user_key', this.token);
      this.route.navigate(['home/course-view'], {
        queryParams: { id: params.id, type: 'course' },
      });
    });
  }

  ngOnInit() {}
}
