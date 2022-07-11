/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-moodle-load',
  templateUrl: './moodle-load.component.html',
  styleUrls: ['./moodle-load.component.scss'],
})
export class MoodleLoadComponent implements OnInit {
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
  ) {
    this.router.queryParams.subscribe((params) => {
      this.token = localStorage.getItem('user_key');
      this.processLink(params.id, params.type);
    });
  }

  ngOnInit() {}

  processLink(id: number, content_type: string) {
    let lms_path = '';
    if (content_type === 'cert') {
      lms_path = '/mod/customcert/view.php?id=';
    } else if (content_type === 'course') {
      lms_path = '/course/view.php?id=';
    }
    this.openLink(environment.moodle_url + lms_path + id);
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
