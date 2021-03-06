/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eqeqeq */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

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
  selector: 'app-bu-admin-dash',
  templateUrl: './bu-admin-dash.component.html',
  styleUrls: ['./bu-admin-dash.component.scss'],
})

export class BuAdminDashComponent implements OnInit {
  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  option = {
    startVal: 0,
    useEasing: true,
    duration: 1,
  };

  details: any;
  lps: any = [];
  lpsDummy: any = [];
  innerWidth: number;

  tabOutlet = [
    { tabString: 'certs', tabName: 'certs', activeState: true },
    { tabString: 'badges', tabName: 'badges', activeState: false },
    { tabString: 'points_lead', tabName: 'points', activeState: false },
  ];

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

  IonSlides: any;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private navCtrl: NavController,
    private route: Router,
    private router: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');

    this.router.queryParams.subscribe((params) => {
      this.init_for_bu_admin();
    });
  }

  ngOnInit() {
    this.onResize();
    this.router.queryParams.subscribe((params) => {
        this.loadLP();
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



  loadLP() {
    const msg = 'Loading, Please Wait ...';
    this.loader.showAutoHideLoader(msg);
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));

    this.service.mod_get_enrol_lps(data).subscribe(
      (res) => {
        this.lps = res.Data;
        console.log(JSON.stringify(this.lps));
        this.lpsDummy = this.lps;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  init_for_bu_admin() {
    const formData = new FormData();
    formData.append('userid', localStorage.getItem('user_id'));
    const buId =localStorage.getItem('buId');
    const buName =localStorage.getItem('buName');
    formData.append('buId', buId);

    this.service.bu_admin_dash_content(formData).subscribe(
      (res) => {
        this.details = res.Data;
        console.log(JSON.stringify('buID: ' + buId + ' buName: '+ buName));
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
    } else if (routeName == 'enrolled') {
      this.navCtrl.navigateForward('/home/mycourses');
    }
  }

  getLPDetails(id) {
    this.route.navigate(['home/lp-summary'], {
      queryParams: { id },
    });
  }

  search(target: any, type: any): void {
    if (type === 'lps') {
      this.lps = this.lpsDummy.filter(
        (item) => item.lpname.search(new RegExp(target.value, 'i')) > -1
      );
    }
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

  toggleTab(flag: any) {
    const index = this.tabOutlet.findIndex((x) => x.tabName === flag);
    if (flag === 'certs') {
      this.activeState(index);
    } else if (flag === 'badges') {
      this.activeState(index);
    } else if (flag === 'points') {
      this.activeState(index);
    }
  }

  activeState(index: number) {
    this.tabOutlet[index].activeState = true;
    let i = 0;
    while (i < this.tabOutlet.length) {
      if (index !== i) {
        this.tabOutlet[i].activeState = false;
      }
      ++i;
    }
  }
}
