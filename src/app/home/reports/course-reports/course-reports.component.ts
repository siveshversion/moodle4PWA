/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-course-reports',
  templateUrl: './course-reports.component.html',
  styleUrls: ['./course-reports.component.scss'],
})
export class CourseReportsComponent implements OnInit {
  data: any;
  displayedColumns = [
    'SN',
    'courseName',
    'enrolledCnt',
    'completedCnt',
    'inprogressCnt',
    'notstartedCnt',
  ];
  coursesList = [];
  catId: any;
  role: any;
  buName: any;
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
    this.route.queryParams.subscribe((params) => {
      this.courseReportList();
      this.role = localStorage.getItem('role');
      this.buName = localStorage.getItem('buName');
    });
  }

  ngOnInit() {}

  courseReportList() {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading course report <br> Please wait...';
    this.loader.showAutoHideLoader(msg);
    this.coursesList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));
    data.append('buId', localStorage.getItem('buId'));

    this.service.course_report(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sno,
            course_id: element.course_id,
            course_name: element.course_fullname,
            enrolled_cnt: element.enrolled_cnt,
            completed_cnt: element.completed_cnt,
            inprogress_cnt: element.inprogress_cnt,
            notstarted_cnt: element.notstarted_cnt,
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

  navMenu(action: any, courseId: any, optionalparam: string) {
    if (action === 'course-detailing') {
      this.navCtrl.navigateForward(
        'home/reports/course-detailed-report?cid=' +
          courseId +
          '&type=' +
          optionalparam
      );
    } else if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + courseId);
    }
  }
}
