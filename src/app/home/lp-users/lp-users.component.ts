import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-lp-users',
  templateUrl: './lp-users.component.html',
  styleUrls: ['./lp-users.component.scss'],
})
export class LpUsersComponent implements OnInit {

  data: any;
  displayedColumns = ['slNo', 'UserName', 'FullName', 'Action'];
  coursesList = [];
  userFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'assigned', viewValue: 'Assigned' },
    { value: 'not_assigned', viewValue: 'Not Assigned' }
  ];
  selectedFilter: any;
  lpId: any;


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
        if (params.id) {
          this.lpId = params.id;
          this.selectedFilter = 'all';
          this.viewLPCourseMembers(this.lpId);
        }
      }
    );

  }

  ngOnInit() { }


  viewLPCourseMembers(lpId: any) {

    this.showLoader('Loading Users...Please wait...');

    this.coursesList = [];

    const data = new FormData();
    data.append('lp_id', lpId);
    data.append('assign_status', this.selectedFilter);

    this.service.lp_course_members(data).subscribe(
      res => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            lp_id: lpId,
            assigned: element.assigned
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


  async unassignUser(uid: any, lpId: any) {

    this.showLoader('Processing Request..');

    const data = new FormData();
    data.append('lp_id', lpId);
    data.append('user_id', uid);
    data.append('creatorId', localStorage.getItem('user_id'));

    this.service.unassign_LP_user(data).subscribe(
      res => {
        let msg = 'User Unassigned Successfully';
        this.showAlert(msg, lpId);
        this.hideLoader();
      }, err => {
        console.log(err);
        this.hideLoader();
      });
  }

  async assignUser(uid: any, lpId: any) {
    this.showLoader('Processing Request..');
    const data = new FormData();
    data.append('lp_id', lpId);
    data.append('user_id', uid);
    data.append('creatorId', localStorage.getItem('user_id'));

    this.service.assign_LP_user(data).subscribe(
      res => {
        if (res.Data.status) {
          let msg = 'User Assigned Successfully';
          this.showAlert(msg, lpId);
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

  async showAlert(msg: string, lpId: any) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.viewLPCourseMembers(lpId);
        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  selectFilter(value: any) {
    this.selectedFilter = value;
    this.viewLPCourseMembers(this.lpId);
  }

}
