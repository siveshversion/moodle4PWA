/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-course-summary',
  templateUrl: './course-summary.component.html',
  styleUrls: ['./course-summary.component.scss'],
})
export class CourseSummaryComponent implements OnInit {
  ratings: any[] = [
    {
      value: 2,
      max: 5,
      color: '#FFFF00',
      readonly: true,
    },
  ];

  courseId: any;
  details: any;
  coursecontents: any = [];
  contents: any = [];
  loading_text: string;
  submittedRating: any = [];

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private router: ActivatedRoute,
    public loadingController: LoadingController,
    private route: Router,
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) {
    this.translateService.setDefaultLang('en');
    this.router.queryParams.subscribe((params) => {
      const msg = 'Loading course summary...';
      this.loader.showAutoHideLoader(msg);
      this.courseId = params.cid;
      this.get_enrolled_course_details();
      this.get_enrolled_course_contents();
      this.get_my_rating();
    });
  }

  ngOnInit() {}

  get_enrolled_course_details() {
    const crsData = new FormData();

    crsData.append('courseid', this.courseId);
    this.service.mod_get_course_details(crsData).subscribe(
      (res) => {
        this.details = res.Data;
        // alert(localStorage.getItem('user_key'));
        //console.log(JSON.stringify(this.details));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get_enrolled_course_contents() {
    const data = new FormData();
    data.append('courseid', this.courseId);
    data.append('user_id', localStorage.getItem('user_id'));

    this.service.mod_get_course_content(data).subscribe(
      (res) => {
        this.coursecontents = res.Data;

        console.log(this.coursecontents);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goToCourse(courseid) {}

  navmenu(url: string) {
    if (url === 'rating-summary') {
      this.route.navigate(['home/rating-summary'], {
        queryParams: { id: this.courseId },
      });
    }
  }

  get_my_rating() {
    const formdata = new FormData();
    formdata.append('userid', localStorage.getItem('user_id'));
    formdata.append('cid', this.courseId);
    this.service.getMyRating(formdata).subscribe(
      (res) => {
        if (res.Data) {
          this.submittedRating = res.Data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
