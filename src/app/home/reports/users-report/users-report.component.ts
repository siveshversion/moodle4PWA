/* eslint-disable max-len */
import { FormBuilder, FormControl } from '@angular/forms';
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
import { FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-report',
  templateUrl: './users-report.component.html',
  styleUrls: ['./users-report.component.scss'],
})
export class UsersReportComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  data: any;
  filterForm = new FormGroup({
    filter: new FormControl(),
  });
  buId: any = '';
  displayedColumns = [
    'SN',
    'UserName',
    'FullName',
    'BusinessUnit',
    'enrolledCnt',
    'completedCnt',
    'inprogressCnt',
    'notstartedCnt',
  ];
  usersList = [];
  bus = [];
  catId: any;
  role: any;
  buName: any;
  url: string;
  dateRange: { from: string; to: string } = { from: '', to: '' };
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('searchVal', { static: true }) searchVal: ElementRef;
  neededBUFilter: any;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((params) => {
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      if (localStorage.getItem('buId')) {
        this.role = localStorage.getItem('role');
        this.buName = localStorage.getItem('buName');
        this.usersReportList(localStorage.getItem('buId'));
        this.neededBUFilter = false;
      } else {
        this.neededBUFilter = true;
        this.getBUs();
        this.usersReportList(-1);
      }
      this.range.patchValue({ start: '', end: '' });
      this.filterForm.patchValue({ filter: '' });
    });
  }

  ngOnInit() {}

  usersReportList(buid: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading users report <br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.usersList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));
    data.append('bu_id', buid);
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

    this.service.user_course_report(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sno,
            course_id: element.course_id,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            bu_name: element.bu_name,
            enrolled_cnt: element.enrolled_cnt,
            completed_cnt: element.completed_cnt,
            inprogress_cnt: element.inprogress_cnt,
            notstarted_cnt: element.notstarted_cnt,
          };
          this.usersList.push(course);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.usersList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ionViewDidEnter() {
    this.dataSource.paginator = this.paginator;
  }

  navMenu(action: any, Id: any, optionalparam: string) {
    let dateParm = '';
    if (optionalparam === 'completed' && this.dateRange.from !== '') {
      dateParm = '&from=' + this.dateRange.from + '&to=' + this.dateRange.to;
    }
    if (action === 'user-course-detailing') {
      this.navCtrl.navigateForward(
        'home/reports/user-detailed-report?uid=' +
          Id +
          '&type=' +
          optionalparam +
          dateParm
      );
    } else if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + Id);
    }
  }

  selectFilter(value: any) {
    this.buId = value;
    this.usersReportList(value);
  }

  getBUs() {
    const formData = new FormData();

    this.service.bu_list(formData).subscribe(
      (res) => {
        this.bus = [];
        res.Data.forEach((element: any) => {
          const BU_data = {
            value: Number(element.bu_id),
            viewValue: element.bu_name,
          };
          this.bus.push(BU_data);
        });
        const all_BU = {
          value: -1,
          viewValue: 'Show All BU',
        };
        this.bus.unshift(all_BU);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setBUSelector(buid: any) {
    if (this.bus.length > 0 && buid > 0) {
      const index = this.bus.findIndex((p) => p.value === buid);
      this.filterForm.controls.bu.setValue(this.bus[index].value);
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
      let tmp_buid =
        typeof localStorage.getItem('buId') === 'object'
          ? -1
          : localStorage.getItem('buId');
      tmp_buid = this.buId === '' && tmp_buid === -1 ? -1 : this.buId;
      this.usersReportList(tmp_buid);
    }
  }


  downloadCreditReprot() {



    this.url = environment.moodle_url + '/cm/phpexcel/Examples/userreport.php?userId=' + localStorage.getItem('user_id') + '&buId=' + localStorage.getItem('buId') + '&fromdate=' + (this.range.value).start + '&todate=' + (this.range.value).end + '&token=' + environment.MOODLE_TOKEN;


    //this.url = environment.moodle_url + '/cm/phpexcel/Examples/coursereport.php';

    window.open(this.url, 'self');
  }


}
