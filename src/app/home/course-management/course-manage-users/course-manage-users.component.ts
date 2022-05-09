import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { GlobalApiService } from 'src/app/services/global-api.service';



@Component({
  selector: 'app-course-manage-users',
  templateUrl: './course-manage-users.component.html',
  styleUrls: ['./course-manage-users.component.scss'],
})

export class CourseManageUsersComponent implements OnInit {

  data: any;
  displayedColumns = ['slNo', 'UserName', 'FullName', 'Action'];
  coursesList = [];
  userFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'enrolled', viewValue: 'Enrolled' },
    { value: 'not_enrolled', viewValue: 'Not Enrolled' }
  ];
  selectedFilter: any;
  courseid: any;



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
          this.selectedFilter = 'all';
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

    this.service.course_members(data).subscribe(
      res => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            course_id: cid,
            enrolled: element.enrolled
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


  unenroll(uid: any, cid: any) {

    this.showLoader('Processing Request..');

    const data = new FormData();
    data.append('course_id', cid);
    data.append('user_id', uid);

    this.service.unenroll_user_to_course(data).subscribe(
      res => {
        let msg = 'User Unenrolled Successfully';
        this.showAlert(msg, cid);
        this.hideLoader();
      }, err => {
        console.log(err);
        this.hideLoader();
      });
  }

  async enrolUser(uid: any, cid: any) {
    this.showLoader('Processing Request..');
    const data = new FormData();
    data.append('course_id', cid);
    data.append('user_id', uid);
    data.append('role_id', '5');

    this.service.enroll_user_to_course(data).subscribe(
      res => {
        if (res.Data.cat_id) {
          const msg = 'User Enrolled Successfully';
          this.showAlert(msg, cid);
          this.hideLoader();
        }
      }, err => {
        console.log(err);
        this.hideLoader();
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
