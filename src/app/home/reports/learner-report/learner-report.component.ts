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
  selector: 'app-learner-report',
  templateUrl: './learner-report.component.html',
  styleUrls: ['./learner-report.component.scss'],
})
export class LearnerReportComponent implements OnInit {
  data: any;
  displayedColumns = [
    'slNo',
    'CourseName',
    'EnrolledOn',
    'LastAccess',
    'Status',
  ];
  coursesList = [];
  userId: any;
  user: any;
  bus = [];

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
      this.ViewUserCourses(localStorage.getItem('user_id'), -1);
    });
  }

  ngOnInit() {}

  ViewUserCourses(uid: any, filterVal: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading User\'s Course Details...Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.coursesList = [];

    const data = new FormData();
    data.append('type', 'all');
    data.append('bu_id', filterVal);
    data.append('userId', uid);
    data.append('user_id', localStorage.getItem('user_id'));

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
            status: element.status,
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
}
