/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eqeqeq */
import { GlobalApiService } from './../../services/global-api.service';
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  option = {
    startVal: 0,
    useEasing: true,
    duration: 1,
  };

  isAdmin: boolean;
  isStudent: boolean;
  role: string;
  dashtitle: string;
  details: any;

  badges = true;
  certs = false;
  points = false;

  lps: any = [];
  lpsDummy: any = [];
  bus: any = [];
  busDummy: any = [];
  innerWidth: number;

  slideOpts = {
    slidesPerView: 0,
    Navigator: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 0,
      slideShadows: true,
    },
  };

  carouselOptions = {
    margin: 25,
    nav: true,
    navText: [
      "<div class='nav-btn prev-slide'></div>",
      "<div class='nav-btn next-slide'></div>",
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 1,
        nav: true,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
      1500: {
        items: 5,
        nav: true,
        loop: false,
      },
    },
  };
  IonSlides: any;

  constructor(
    private service: GlobalApiService,
    private navCtrl: NavController,
    public loadingController: LoadingController,
    private route: Router,
    private router: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');

    this.router.queryParams.subscribe((params) => {
      this.role = localStorage.getItem('role');
      if (this.role === 'admin') {
        this.isAdmin = true;
        this.isStudent = false;
        this.dashtitle = 'welcome_moodle';
        this.init_for_admin();
      } else {
        this.isStudent = true;
        this.isAdmin = false;
        this.dashtitle = 'welcome_learner';
      }
    });
  }

  ngOnInit() {
    this.onResize();
    this.router.queryParams.subscribe((params) => {
      if (this.isAdmin) {
        this.loadBU();
      } else {
        this.loadLP();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.slideOpts.slidesPerView = 1;
    } else {
      this.slideOpts.slidesPerView = 4;
    }
  }

  loadBU() {
    this.showLoader_1();
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));

    this.service.mod_get_my_bus(data).subscribe(
      (res) => {
        this.bus = res.Data;
        console.log(JSON.stringify(this.bus));
        this.busDummy = this.bus;
        this.hideLoader_1();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadLP() {
    this.showLoader_1();
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));

    this.service.mod_get_enrol_lps(data).subscribe(
      (res) => {
        this.lps = res.Data;
        console.log(JSON.stringify(this.lps));
        this.lpsDummy = this.lps;
        this.hideLoader_1();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  init_for_admin() {
    const formData = new FormData();
    this.service.admin_dash_content(formData).subscribe(
      (res) => {
        this.details = res.Data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  navMenu(routeName: any) {
    if (routeName == 'users') {
      this.navCtrl.navigateForward('/home/users');
    } else if (routeName == 'course-list') {
      this.navCtrl.navigateForward('/home/courses');
    } else if (routeName == 'lps') {
      this.navCtrl.navigateForward('/home/lps');
    } else if (routeName == 'bus') {
      this.navCtrl.navigateForward('/home/bus');
    }
  }

  getLPDetails(id) {
    this.route.navigate(['home/lp-summary'], {
      queryParams: { id },
    });
  }

  getBUDetails(id) {
    this.route.navigate(['home/bus'], {});
  }

  search(target: any): void {
    this.lps = this.lpsDummy.filter(
      (item) => item.fullname.search(new RegExp(target.value, 'i')) > -1
    );
    //console.log(JSON.stringify(this.lps));
  }

  next(count) {
    let i = 0;
    this.slides.forEach((element) => {
      // eslint-disable-next-line eqeqeq
      if (i == count) {
        element.slideNext();
      }
      i++;
    });
  }

  prev(count) {
    let i = 0;
    this.slides.forEach((element) => {
      // eslint-disable-next-line eqeqeq
      if (i == count) {
        element.slidePrev();
      }
      i++;
    });
  }

  showLoader_1() {
    this.loadingController
      .create({
        message: 'Loading, Please Wait ...',
      })
      .then((res) => {
        res.present();
      });
  }

  hideLoader_1() {
    this.loadingController
      .dismiss()
      .then((res) => {})
      .catch((error) => {});
  }

  getCerts() {
    return null;
  }

  getBadges() {
    return null;
  }

  toggleTab(flag: any) {
    if (flag === 'certs') {
      this.certs = true;
      this.badges = false;
      this.points = false;
      this.getCerts();
    } else if (flag === 'badges') {
      this.certs = false;
      this.badges = true;
      this.points = false;
      this.getCerts();
      this.getBadges();
    } else if (flag === 'points') {
      this.certs = false;
      this.badges = false;
      this.points = true;
      this.getCerts();
      this.getBadges();
    }
  }
}
