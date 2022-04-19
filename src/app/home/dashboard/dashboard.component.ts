import { GlobalApiService } from './../../services/global-api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  option = {
    startVal: 0,
    useEasing: true,
    duration: 1
  };

  isAdmin: Boolean;
  isStudent: Boolean;
  role: string;
  dashtitle: string;
  userscount: any;
  coursescount: any;
  lpscount: any;


  constructor(private service: GlobalApiService, private navCtrl: NavController, public loadingController: LoadingController, private router: ActivatedRoute, private translateService: TranslateService, private route: Router) {

    this.translateService.setDefaultLang('en');

    this.router.queryParams.subscribe(
      params => {
        this.role = localStorage.getItem('role');
        if (this.role === 'admin') {
          this.isAdmin = true;
          this.isStudent = false;
          this.dashtitle = 'welcome_moodle';
          this.init_for_admin();
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


  init_for_admin() {
    let formData = new FormData();
    this.service.admin_dash_content(formData).subscribe(
      res => {
        this.userscount = res.Data.usersCount;
        this.coursescount = res.Data.coursesCount;
        this.lpscount = res.Data.lpsCount;
      },
      err => {
        console.log(err);

      }
    );
  }


  navMenu(routeName: any) {
    if (routeName == 'users') {
      this.navCtrl.navigateForward('/home/users');
    } else if (routeName == 'course-list') {
      this.navCtrl.navigateForward('/home/courses');
    }  else if (routeName == 'lps') {
      this.navCtrl.navigateForward('/home/lps');
    }
  }

}
