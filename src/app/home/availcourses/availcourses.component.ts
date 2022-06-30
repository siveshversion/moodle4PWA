/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-availcourses',
  templateUrl: './availcourses.component.html',
  styleUrls: ['./availcourses.component.scss'],
})
export class AvailcoursesComponent implements OnInit {
  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  role: string;
  avCourses: any;
  selectedFilter: any;
  coursesDummy: any = [];
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

  ngOnInit() {
    this.onResize();
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

  search(target: any): void {
    this.avCourses = this.coursesDummy.filter(
      (item) => item.fullname.search(new RegExp(target.value, 'i')) > -1
    );
    //console.log(JSON.stringify(this.courses));
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
}
