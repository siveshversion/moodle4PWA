/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */

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
  @ViewChild('searchVal', { static: true }) searchVal: ElementRef;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
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
    formData.append('bu_id', buId);
    this.service.get_bu_by_id(formData).subscribe((response) => {
      if (response) {
        this.buName = response.Data.buname;
      }
    });
  }

  viewBUCourseMembers(buId: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading Managers...Please wait...';
    this.loader.showAutoHideLoader(msg);
    this.coursesList = [];

    const data = new FormData();
    data.append('bu_id', buId);
    data.append('assign_status', this.selectedFilter);

    this.service.bu_users(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            user_name: element.user_name,
            user_fullname: element.user_fullname,
            user_id: element.user_id,
            bu_id: buId,
            allotted_bu_name: element.allotted_bu_name,
            assigned: element.assigned,
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

  async unassignManager(uid: any, buId: any) {
    let msg = 'Processing Request..';
    this.loader.showAutoHideLoader(msg);

    const data = new FormData();
    data.append('bu_id', buId);
    data.append('user_id', uid);
    data.append('creatorId', localStorage.getItem('user_id'));

    this.service.unassign_BU_manager(data).subscribe(
      (res) => {
        msg = 'Manager Unassigned Successfully';
        this.showAlert(msg, buId);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async assignManager(uid: any, buId: any) {
    let msg = 'Processing Request..';
    this.loader.showAutoHideLoader(msg);
    const data = new FormData();
    data.append('bu_id', buId);
    data.append('user_id', uid);
    data.append('creatorId', localStorage.getItem('user_id'));

    this.service.assign_BU_manager(data).subscribe(
      (res) => {
        if (res.Data.status) {
          msg = 'Manager Assigned Successfully';
          this.showAlert(msg, buId);
        }
      },
      (err) => {
        console.log(err);
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
