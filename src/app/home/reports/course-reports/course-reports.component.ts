/* eslint-disable max-len */
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
import { DateAdapter } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-reports',
  templateUrl: './course-reports.component.html',
  styleUrls: ['./course-reports.component.scss'],
})
export class CourseReportsComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  url: string;
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
  dateRange: { from: string; to: string } = { from: '', to: '' };
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
    private navCtrl: NavController,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((params) => {
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      this.courseReportList();
      this.role = localStorage.getItem('role');
      this.buName = localStorage.getItem('buName');
      this.range.patchValue({ start: '', end: '' });
    });
  }

  ngOnInit() { }

  courseReportList() {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading course report <br> Please wait...';
    this.loader.showAutoHideLoader(msg);
    this.coursesList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));
    data.append('buId', localStorage.getItem('buId'));
    if (localStorage.getItem('edate')) {
      let sdate = localStorage.getItem('sdate');
      let edate = localStorage.getItem('edate');
      data.append('sdate', sdate);
      data.append('edate', edate);
      sdate = sdate.split('/').join('-');
      edate = edate.split('/').join('-');
      this.dateRange = {
        from: sdate,
        to: edate,
      };
      localStorage.removeItem('sdate');
      localStorage.removeItem('edate');
    }

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
    let dateParm = '';
    if (optionalparam === 'completed' && this.dateRange.from !== '') {
      dateParm = '&from=' + this.dateRange.from + '&to=' + this.dateRange.to;
    }
    if (action === 'course-detailing') {
      this.navCtrl.navigateForward(
        'home/reports/course-detailed-report?cid=' +
        courseId +
        '&type=' +
        optionalparam +
        dateParm
      );
    } else if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + courseId);
    }
  }

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
    if (dateRangeEnd.value) {
      localStorage.setItem('sdate', dateRangeStart.value);
      localStorage.setItem('edate', dateRangeEnd.value);
      this.courseReportList();
    }
  }

  downloadCreditReprot() {



    this.url = environment.moodle_url + '/cm/phpexcel/Examples/coursereport.php?userId=' + localStorage.getItem('user_id') + '&buId=' + localStorage.getItem('buId') + '&fromdate=' + (this.range.value).start + '&todate=' + (this.range.value).end + '&token=' + environment.MOODLE_TOKEN;


    //this.url = environment.moodle_url + '/cm/phpexcel/Examples/coursereport.php';

    window.open(this.url, 'self');
  }


}
