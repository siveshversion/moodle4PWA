import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalApiService } from 'src/app/services/global-api.service';
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
  redirectUrl: any = "";
  content = "";
  expire_status: any;
  courseName: any;

  constructor(private service: GlobalApiService, private router: ActivatedRoute, private sanitizer: DomSanitizer, public loadingController: LoadingController, private route: Router) { }

  ngOnInit() {
    //this.showLoader();
    this.token = localStorage.getItem('user_key');
    this.router.queryParams.subscribe(
      params => {
        this.courseId = params.id;
        this.openLink(environment.moodle_url + '/course/view.php?id=' + params.id);

      }
    );


  }

  openLink(url: any) {
    let user_key = localStorage.getItem('user_key');
    this.redirectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.moodle_url + '/auth/userkey/login.php?key=' + user_key + '&wantsurl=' + url + '&embedded=true');
    console.log('qqq' + this.redirectUrl);
    // this.redirectUrl =  url;
    this.isRedirect = true;
  }

  // Show the loader for infinite time
  showLoader() {
    this.loadingController.create({
      message: 'Loading Activities Please wait...'
    }).then((res) => {
      res.present();
    });
  }

  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingController.dismiss().then((res) => {
    }).catch((error) => {
    });
  }


  frameUpdate(event: any) {
    // document.querySelector('iframe').contentDocument.body.querySelector('nav').style.display='none';
    // document.querySelector('iframe').contentDocument.body.querySelector('nav').style.display='none';
  }

}