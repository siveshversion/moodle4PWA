/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-availcourses',
  templateUrl: './availcourses.component.html',
  styleUrls: ['./availcourses.component.scss'],
})
export class AvailcoursesComponent implements OnInit {
  role: string;
  avCourses: any;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private router: ActivatedRoute,
    public loadingController: LoadingController,
    private route: Router,
    private translateService: TranslateService,
    private navCtrl: NavController
  ) {
    this.translateService.setDefaultLang('en');
    this.router.queryParams.subscribe((params) => {
      this.role = localStorage.getItem('role');
      const msg = 'Loading available courses';
      this.loader.showAutoHideLoader(msg);
      this.load_availCourses();
    });
  }

  ngOnInit() {}

  load_availCourses() {
    const data = new FormData();
    data.append('user_id', localStorage.getItem('user_id'));
    this.service.get_avail_courses(data).subscribe(
      (res) => {
        this.avCourses = res.Data;
        console.log('availCourses: ' + JSON.stringify(this.avCourses));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goToCourse(courseid) {
    this.route.navigate(['home/course'], { queryParams: { id: courseid } });
  }
}
