/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MenuController,
  NavController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-points-detailing-report',
  templateUrl: './points-detailing-report.component.html',
  styleUrls: ['./points-detailing-report.component.scss'],
})
export class PointsDetailingReportComponent implements OnInit {
  data: any;
  displayedColumns = ['slNo', 'PType', 'Name', 'Points'];
  coursesList = [];
  userId: any;
  type: string;
  user: any;
  totalPoints = 0;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private service: GlobalApiService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private router: ActivatedRoute,
    private modalController: ModalController

  ) {
    this.router.queryParams.subscribe((params) => {
      if (params.uid) {
        this.userId = params.uid;
        this.type = params.type;
        this.ViewUserCourses(params.uid);
      }
    });
  }

  ngOnInit() {}

  ViewUserCourses(uid: any) {
    this.showLoader('Loading  Points Detail...<br>Please wait...');

    this.coursesList = [];

    const data = new FormData();
    data.append('type', this.type);
    data.append('userId', uid);
    data.append('user_id', localStorage.getItem('user_id'));

    this.service.user_point_filtered_courses(data).subscribe(
      (res) => {
        this.totalPoints = res.Data.totalPoints;
        this.user = res.Data.fullname;
        if (res.Data.exists === 1) {
        res.Data.courseAlike.forEach((element: any) => {
          const user = {
            sl_no: element.slno,
            ptype: element.ptype,
            name: element.aname,
            points: element.points
          };
          this.coursesList.push(user);
        });
      }
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

  async closeModal() {
    await this.modalController.dismiss();
  }





}
