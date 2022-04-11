import { GlobalApiService } from './../../../services/global-api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-course-stats',
  templateUrl: './my-course-stats.component.html',
  styleUrls: ['./my-course-stats.component.scss'],
})
export class MyCourseStatsComponent implements OnInit {

  option = {
    startVal: 0,
    useEasing: true,
    duration: 2
  };

  constructor(private service: GlobalApiService, private navCtrl: NavController, public loadingController: LoadingController, private router: ActivatedRoute, private translateService: TranslateService, private route: Router) {

    this.translateService.setDefaultLang('en');

    this.router.queryParams.subscribe(
      params => {
        this.getCrsStats();
      }
    );

  }

  crsEnrolled = 0;
  crsComplete = 0;
  crsNotstart = 0;
  crsInprogrs = 0;


  ngOnInit() {}




  getCrsStats() {
    this.service.lc_mod_get_course_status_count().subscribe(
      res => {
        //console.log(JSON.stringify(res));
        this.crsEnrolled = res.Data.enrolled_courses;
        this.crsComplete = res.Data.complete_courses;
        this.crsNotstart = res.Data.plain_courses;
        this.crsInprogrs = res.Data.course_inprogress;
      },
      err => {
        console.log(err);
      }
    );
  }





  navMenu(routeName: String, activetab: any) {

    if (activetab == 'completed' || activetab == 'enrolled') {
      localStorage.setItem('active_tab', activetab);
    }
    else {
      localStorage.setItem('active_tab', 'default');
    }
    if (routeName === 'enrolled-completed-courses') {
      this.navCtrl.navigateForward('/home/report/enrolled-completed-courses');
    }
  }

}
