import { FormBuilder, FormControl } from '@angular/forms';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-users-report',
  templateUrl: './users-report.component.html',
  styleUrls: ['./users-report.component.scss'],
})
export class UsersReportComponent implements OnInit {
  data: any;
  filterForm: FormGroup;
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
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((params) => {
      this.getBUs();
      this.usersReportList(-1);
    });
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: new FormControl(),
    });
  }

  usersReportList(buid: any) {
    const msg = 'Loading users report <br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.usersList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));
    data.append('bu_id', buid);

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
    if (action === 'user-course-detailing') {
      this.navCtrl.navigateForward(
        'home/reports/user-detailed-report?uid=' + Id + '&type=' + optionalparam
      );
    } else if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + Id);
    }
  }

  selectFilter(value: any) {
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
}
