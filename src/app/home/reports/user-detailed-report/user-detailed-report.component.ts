/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-user-detailed-report',
  templateUrl: './user-detailed-report.component.html',
  styleUrls: ['./user-detailed-report.component.scss'],
})
export class UserDetailedReportComponent implements OnInit {
  data: any;
  displayedColumns = [
    'slNo',
    'CourseName',
    'EnrolledOn',
    'LastAccess',
    'CompletedOn',
  ];
  coursesList = [];
  userFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'enrolled', viewValue: 'Enrolled' },
    { value: 'not_enrolled', viewValue: 'Not Enrolled' },
  ];
  userId: any;
  type: string;
  user: any;
  bus = [];
  dateRange: { from: string; to: string } = { from: '', to: '' };

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchVal', { static: true }) searchVal: ElementRef;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private router: ActivatedRoute,
    private modalController: ModalController,
    private formBuilder: FormBuilder,

    private navCtrl: NavController
  ) {
    this.router.queryParams.subscribe((params) => {
      if (params.uid) {
        this.userId = params.uid;
        this.type = params.type;
        if (params.from && params.to) {
          this.dateRange.from = params.from;
          this.dateRange.to = params.to;
        }
        this.ViewUserCourses(params.uid, -1);
      }
    });
  }

  ngOnInit() {}

  ViewUserCourses(uid: any, filterVal: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading User\'s Course Details...Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.coursesList = [];

    const data = new FormData();
    data.append('type', this.type);
    data.append('bu_id', filterVal);
    data.append('userId', uid);
    data.append('user_id', localStorage.getItem('user_id'));

    if (this.dateRange.to.length > 1) {
      const sdate = this.dateRange.from;
      const edate = this.dateRange.to;
      data.append('sdate', sdate);
      data.append('edate', edate);
    }

    this.service.user_filtered_courses(data).subscribe(
      (res) => {
        this.user = res.Data.User;
        res.Data.Courses.forEach((element: any) => {
          const user = {
            sl_no: element.sl_no,
            course_name: element.course_name,
            course_id: element.course_id,
            enrolled_on: element.enrolled_on,
            last_access: element.last_access,
            completed_on: element.completed_on,
          };
          this.coursesList.push(user);
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

  async closeModal() {
    await this.modalController.dismiss();
  }

  async showAlert(msg: string, uid: any) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.ViewUserCourses(uid, -1);
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  selectFilter(value: any) {
    this.ViewUserCourses(this.userId, value);
  }
}
