/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MenuController,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit, OnDestroy {
  data: any;
  displayedColumns = [
    'courseName',
    'courseShortName',
    'categoryName',
    'enrolledCnt',
    'Action',
  ];
  coursesList = [];
  role: any;
  buName: any;
  parametersObservable: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('searchVal', { static: true }) searchVal: ElementRef;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.role = localStorage.getItem('role');
    if (localStorage.getItem('role') === 'manager') {
      this.buName = localStorage.getItem('buName');
    } else {
      this.buName = null;
    }
    this.parametersObservable = this.route.queryParams.subscribe((params) => {
      this.courseList(params.cat, params.buId);
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.parametersObservable != null) {
      this.parametersObservable.unsubscribe();
    }
  }

  courseList(cat: any, buId: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading course list...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);
    this.coursesList = [];
    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));
    if (localStorage.getItem('buId')) {
      data.append('buId', localStorage.getItem('buId'));
    } else if (buId) {
      data.append('buId', buId);
    }

    if (cat) {
      data.append('catId', cat);
    } else {
      data.append('catId', '');
    }

    this.service.course_list(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const cnt = Number(element.course_courses_cnt);
          const course_exist = cnt > 0 ? true : false;

          const course = {
            course_id: element.course_id,
            course_name: element.course_fullname,
            course_short_name: element.course_shortname,
            category_name: element.category_name,
            category_id: element.category_id,
            enrolled_cnt: element.enrolled_cnt,
            can_edit: element.can_edit
          };
          this.coursesList.push(course);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.coursesList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ionViewDidEnter() {
    this.dataSource.paginator = this.paginator;
  }

  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingController
      .dismiss()
      .then((res) => {})
      .catch((error) => {});
  }

  navMenu(action: any, courseId: any, catId: any) {
    if (action === 'edit') {
      this.navCtrl.navigateForward(
        'home/coursecreation?cid=' + courseId + '&cat=' + catId
      );
    } else if (action === 'view_users') {
      this.navCtrl.navigateForward('home/courseparticipants?cid=' + courseId);
    } else if (action === 'add') {
      this.navCtrl.navigateForward('home/coursecreation?cat=' + catId);
    } else if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + courseId);
    }
  }
}
