/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  courseId: any;
  contents: any = [];
  details: any = [];
  panelOpenState = false;
  token: any;
  isRedirect = true;
  redirectUrl: any = '';
  content = '';
  expire_status: any;
  courseName: any;

  constructor(
    private service: GlobalApiService,
private loader: LoaderService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public loadingController: LoadingController,
    private route: Router
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('user_key');

    const data = new FormData();
    data.append('username', localStorage.getItem('username'));
    data.append('password', localStorage.getItem('password'));

    this.service.lp_generate_get_user_token(data).subscribe((res) => {
      this.token = res.Data.user_token;
    });

    this.router.queryParams.subscribe((params) => {
      this.courseId = params.id;
      this.openLink(
        environment.moodle_url + '/course/view.php?id=' + params.id
      );
    });
  }

  openLink(url: any) {
    const user_key = this.token;
    this.redirectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.moodle_url +
        '/auth/userkey/login.php?key=' +
        user_key +
        '&wantsurl=' +
        url +
        '&embedded=true'
    );
    console.log('qqq' + this.redirectUrl);
    // this.redirectUrl =  url;
    this.isRedirect = true;
  }


  frameUpdate(event: any) {
    // document.querySelector('iframe').contentDocument.body.querySelector('nav').style.display='none';
    // document.querySelector('iframe').contentDocument.body.querySelector('nav').style.display='none';
  }
}
