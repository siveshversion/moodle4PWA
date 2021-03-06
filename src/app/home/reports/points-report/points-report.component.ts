/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MenuController,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-points-report',
  templateUrl: './points-report.component.html',
  styleUrls: ['./points-report.component.scss'],
})
export class PointsReportComponent implements OnInit {
  data: any;
  displayedColumns = ['slNo', 'UserName', 'Points'];
  pointList = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('searchVal', { static: true }) searchVal: ElementRef;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    this.pointsList();
  }

  pointsList() {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading Points Report...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.pointList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));

    this.service.point_list(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const p = {
            sl_no: element.slno,
            full_name: element.full_name,
            userid: element.userid,
            email_id: element.email_id,
            points: element.points,
          };
          this.pointList.push(p);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.pointList);
    this.dataSource.paginator = this.paginator;
  }

  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {},
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ionViewDidEnter() {
    this.dataSource.paginator = this.paginator;
  }

  navMenu(userId: number) {
    this.router.navigate(['home/reports/points-detail-report'], {
      queryParams: { uid: userId },
    });
  }
}
