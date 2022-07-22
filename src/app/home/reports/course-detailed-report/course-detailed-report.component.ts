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
  selector: 'app-course-detailed-report',
  templateUrl: './course-detailed-report.component.html',
  styleUrls: ['./course-detailed-report.component.scss'],
})
export class CourseDetailedReportComponent implements OnInit {
  data: any;
  displayedColumns = ['slNo', 'UserName', 'FullName', 'BusinessUnit', 'CourseCompletedOn'];
  coursesList = [];
  userFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'enrolled', viewValue: 'Enrolled' },
    { value: 'not_enrolled', viewValue: 'Not Enrolled' },
  ];
  courseid: any;
  type: string;
  filterForm: FormGroup;
  course: any;
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
      if (params.cid) {
        this.courseid = params.cid;
        this.type = params.type;
        this.getBUs();
        if (params.from && params.to) {
          this.dateRange.from = params.from;
          this.dateRange.to = params.to;
        }
        this.viewCourseMembers(params.cid, -1);
      }
    });
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: new FormControl(),
    });
  }

  viewCourseMembers(cid: any, filterVal: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading Users...Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.coursesList = [];

    const data = new FormData();
    data.append('course_id', cid);
    data.append('type', this.type);
    data.append('bu_id', filterVal);
    data.append('userId', localStorage.getItem('user_id'));
    if (this.dateRange.to.length > 1) {
      const sdate = this.dateRange.from;
      const edate = this.dateRange.to;
      data.append('sdate', sdate);
      data.append('edate', edate);
    }

    this.service.course_filtered_members(data).subscribe(
      (res) => {
        this.course = res.Data.Course;
        res.Data.Participants.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            course_id: cid,
            enrolled: element.enrolled,
            bu_name: element.bu_name,
            completed_on: element.completed_on
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

  async closeModal() {
    await this.modalController.dismiss();
  }

  async showAlert(msg: string, cid: any) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.viewCourseMembers(cid, -1);
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  selectFilter(value: any) {
    this.viewCourseMembers(this.courseid, value);
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
