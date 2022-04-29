/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */

import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-bu-users',
  templateUrl: './bu-users.component.html',
  styleUrls: ['./bu-users.component.scss'],
})
export class BuUsersComponent implements OnInit {
  data: any;
  displayedColumns = ['slNo', 'UserName', 'FullName', 'BusinessUnit', 'Action'];
  coursesList = [];
  userFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'assigned', viewValue: 'Assigned' },
    { value: 'not_assigned', viewValue: 'Not Assigned' },
  ];
  selectedFilter: any;
  buId: any;
  buName: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private service: GlobalApiService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private router: ActivatedRoute,
    private modalController: ModalController,
    private navCtrl: NavController
  ) {
    this.router.queryParams.subscribe((params) => {
      if (params.id) {
        this.buId = params.id;
        this.selectedFilter = 'all';
        this.setBUTitle(this.buId);
        this.viewBUCourseMembers(this.buId);
      }
    });
  }

  ngOnInit() {}

  setBUTitle(buId: any) {
    const formData = new FormData();
    formData.append("bu_id", buId);
    this.service.get_bu_by_id(formData).subscribe((response) => {
      if (response) {
          this.buName = response.Data.buname;
      }
    });
  }


  viewBUCourseMembers(buId: any) {
    this.showLoader('Loading Users...Please wait...');

    this.coursesList = [];

    const data = new FormData();
    data.append('bu_id', buId);
    data.append('assign_status', this.selectedFilter);

    this.service.bu_course_members(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            bu_id: buId,
            allotted_buId: element.allotted_buId,
            allotted_bu_name: element.allotted_bu_name,
            assigned: element.assigned,
          };
          this.coursesList.push(course);
        });
        this.applyFilter('');
        this.hideLoader();
      },
      (err) => {
        console.log(err);
        this.hideLoader();
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

  // Show the loader for infinite time
  showLoader(msg: any) {
    this.loadingController
      .create({
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }

  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingController
      .dismiss()
      .then((res) => {})
      .catch((error) => {});
  }

  async unassignUser(uid: any, buId: any) {
    this.showLoader('Processing Request..');

    const data = new FormData();
    data.append('bu_id', buId);
    data.append('user_id', uid);
    data.append('creatorId', localStorage.getItem('user_id'));

    this.service.unassign_BU_user(data).subscribe(
      (res) => {
        const msg = 'User Unassigned Successfully';
        this.showAlert(msg, buId);
        this.hideLoader();
      },
      (err) => {
        console.log(err);
        this.hideLoader();
      }
    );
  }

  async assignUser(uid: any, buId: any) {
    this.showLoader('Processing Request..');
    const data = new FormData();
    data.append('bu_id', buId);
    data.append('user_id', uid);
    data.append('creatorId', localStorage.getItem('user_id'));

    this.service.assign_BU_user(data).subscribe(
      (res) => {
        if (res.Data.status) {
          const msg = 'User Assigned Successfully';
          this.showAlert(msg, buId);
          this.hideLoader();
        }
      },
      (err) => {
        console.log(err);
        this.hideLoader();
      }
    );
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async showAlert(msg: string, buId: any) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.viewBUCourseMembers(this.buId);
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  selectFilter(value: any) {
    this.selectedFilter = value;
    this.viewBUCourseMembers(this.buId);
  }
}
