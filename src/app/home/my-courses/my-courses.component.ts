/* eslint-disable @typescript-eslint/naming-convention */
import { GlobalApiService } from './../../services/global-api.service';
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  HostListener,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { NavController, LoadingController } from '@ionic/angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export interface CatCourses {
  categoryId: number;
  categoryName: string;
  categoryCourses: [];
}

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit {
  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  innerWidth: number;
  courses: any = [];
  categories: any = [];
  summary: string;
  catCrs: CatCourses[] = [];
  coursesDummy: any = [];
  allCourses: any = [];
  allCoursesDummy: any = [];
  selectedFilter: any;
  filterForm: FormGroup;
  filterType: string;

  enrollStatFilter = [
    { value: 'enrolled', viewValue: 'Enrolled' },
    { value: 'in_progress', viewValue: 'In Progress' },
    { value: 'not_started', viewValue: 'Not Started' },
    { value: 'completed', viewValue: 'Completed' },
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

  carouselOptions = {
    margin: 25,
    nav: true,
    navText: [
      '<div class=\'nav-btn prev-slide\'></div>',
      '<div class=\'nav-btn next-slide\'></div>',
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
    private route: Router,
    public loadingController: LoadingController,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) {
    this.router.queryParams.subscribe((params) => {
      if (params.filter) {
        this.filterType = params.filter;
      }
      this.loadCourse(this.filterType);
    });
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: new FormControl(),
    });

    this.setFilter(this.filterType);
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

  ionViewDidEnter() {
    //this.navMenu();
  }

  navMenu() {
    this.navCtrl.navigateForward('/home/courses', {
      queryParams: { load: true },
    });
  }

  loadCourse(filtertype: string) {
    this.showLoader_1();
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));
    data.append('selected_filter', filtertype);

    this.coursesDummy = [];

    this.service.mod_get_filtered_courses(data).subscribe(
      (res) => {
        this.courses = res.Data;
        console.log(JSON.stringify(this.courses));
        this.coursesDummy = this.courses;
        const type = typeof this.courses;
        // eslint-disable-next-line eqeqeq
        if (this.courses) {
          this.courses.forEach((element) => {
            if (element.overviewfiles.length !== 0) {
              Object.assign(element, {
                imgUrl:
                  element.overviewfiles[0].fileurl +
                  '?token=' +
                  localStorage.getItem('user_key'),
              });
            } else {
              Object.assign(element, { imgUrl: './assets/icon/crs-img.jpg' });
            }
          });
        }

        this.hideLoader_1();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCourseDetails(id, status) {
    this.route.navigate(['home/coursesummary'], {
      queryParams: { cid: id, status },
    });
  }

  search(target: any): void {
    this.courses = this.coursesDummy.filter(
      (item) => item.fullname.search(new RegExp(target.value, 'i')) > -1
    );
    //console.log(JSON.stringify(this.courses));
  }

  searchAllCourse(value: any): void {
    this.allCourses = this.allCoursesDummy.filter(
      (item) => item.fullname.search(new RegExp(value, 'i')) > -1
    );
    //console.log(JSON.stringify(this.courses));
  }

  hideLoader_1() {
    this.loadingController
      .dismiss()
      .then((res) => {})
      .catch((error) => {});
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

  onScrollDown() {
    alert();
    console.log('scrolled!!');
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

  selectFilter(value: any) {
    this.selectedFilter = value;
    this.loadCourse(value);
  }

  setFilter(value: string) {
    const index = this.enrollStatFilter.findIndex((p) => p.value === value);
    if (this.enrollStatFilter) {
      this.filterForm.controls.filter.setValue(
        this.enrollStatFilter[index].value
      );
    }
  }
}
