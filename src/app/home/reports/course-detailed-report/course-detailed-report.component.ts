/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-course-detailed-report',
  templateUrl: './course-detailed-report.component.html',
  styleUrls: ['./course-detailed-report.component.scss'],
})


export class CourseDetailedReportComponent implements OnInit {

  data: any;
  displayedColumns = ['slNo', 'UserName', 'FullName','BusinessUnit'];
  coursesList = [];
  userFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'enrolled', viewValue: 'Enrolled' },
    { value: 'not_enrolled', viewValue: 'Not Enrolled' }
  ];
  selectedFilter: any;
  courseid: any;
  type: string;
  course: any;


  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(
    private service: GlobalApiService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private router: ActivatedRoute,
    private modalController: ModalController,
    private navCtrl: NavController) {

    this.router.queryParams.subscribe(
      params => {
        if (params.cid) {
          this.courseid = params.cid;
          this.type = params.type;
          this.selectedFilter = 'enrolled';
          this.viewCourseMembers(params.cid);
        }
      }
    );

  }

  ngOnInit() { }


  viewCourseMembers(cid: any) {

    this.showLoader('Loading Users...Please wait...');

    this.coursesList = [];

    const data = new FormData();
    data.append('course_id', cid);
    data.append('enroll_status', this.selectedFilter);
    data.append('type', this.type);
    data.append('userId', localStorage.getItem('user_id'));

    this.service.course_filtered_members(data).subscribe(
      res => {
        this.course = res.Data.Course;
        res.Data.Participants.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            course_id: cid,
            enrolled: element.enrolled,
            bu_name: element.bu_name
          };
          this.coursesList.push(course);
        });
        this.applyFilter('');
        this.hideLoader();
      }, err => {
        console.log(err);
        this.hideLoader();
      });

    this.dataSource = new MatTableDataSource<any>(this.coursesList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ionViewDidEnter() {
    this.dataSource.paginator = this.paginator;
  }

  // Show the loader for infinite time
  showLoader(msg: any) {
    this.loadingController.create({
      message: msg,
    }).then((res) => {
      res.present();
    });
  }

  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingController.dismiss().then((res) => {
    }).catch((error) => {
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async showAlert(msg: string, cid: any) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.viewCourseMembers(cid);
        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  selectFilter(value: any) {
    this.selectedFilter = value;
    this.viewCourseMembers(this.courseid);
  }

}
