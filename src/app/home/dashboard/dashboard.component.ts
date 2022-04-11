import { GlobalApiService } from './../../services/global-api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyCourseStatsComponent } from '../widget/my-course-stats/my-course-stats.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  isAdmin: Boolean;
  isStudent: Boolean;
  role: string;
  dashtitle: string;

  constructor(private service: GlobalApiService, private navCtrl: NavController, public loadingController: LoadingController, private router: ActivatedRoute, private translateService: TranslateService, private route: Router) {

    this.translateService.setDefaultLang('en');

    this.router.queryParams.subscribe(
      params => {
        this.role = localStorage.getItem('role');
        if (this.role === 'admin') {
          this.isAdmin = true;
          this.isStudent = false;
          this.dashtitle = 'welcome_moodle';
        }
        else {
          this.isStudent = true;
          this.isAdmin = false;
          this.dashtitle = 'welcome_learner';
        }
      }
    );


  }

  ngOnInit() { }

}
