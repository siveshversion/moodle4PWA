import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-course-summary',
  templateUrl: './course-summary.component.html',
  styleUrls: ['./course-summary.component.scss'],
})
export class CourseSummaryComponent implements OnInit {

  courseId: any;
  details: any;
  coursecontents: any = [];
  contents: any = [];
  loading_text: string;


  constructor(private service: GlobalApiService, private sanitizer: DomSanitizer, private router: ActivatedRoute, public loadingController: LoadingController, private route: Router, private translateService: TranslateService, private formBuilder: FormBuilder) {
    this.translateService.setDefaultLang('en');
    this.router.queryParams.subscribe(
      params => {
        this.showLoader();
        this.courseId = params.cid;
        this.get_enrolled_course_details();
        this.get_enrolled_course_contents();
      }

    );
  }



  ngOnInit() { }

  get_enrolled_course_details() {
    const crsData = new FormData();

    crsData.append('courseid', this.courseId);
    this.service.mod_get_course_details(crsData).subscribe(
      res => {
        this.details = res.Data;
        // alert(localStorage.getItem('user_key'));
        //console.log(JSON.stringify(this.details));

        this.hideLoader();
      },
      err => {
        console.log(err);

      }
    );
  }

  get_enrolled_course_contents() {
    const data = new FormData();
    data.append('courseid', this.courseId);
    data.append('user_id', localStorage.getItem('user_id'));

    this.service.mod_get_course_content(data).subscribe(
      res => {
        this.coursecontents = res.Data;

        console.log(this.coursecontents);
      },
      err => {

        console.log(err);

      }
    );
  }

  // Show the loader for infinite time
  showLoader() {
    this.translateService.get('loading').subscribe((loading_res: string) => {

      this.loading_text = loading_res;
    })
    this.loadingController.create({
      message: this.loading_text
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


  goToCourse(courseid) {
    this.route.navigate(['home/course'], { queryParams: { id: courseid } });
  }

}
