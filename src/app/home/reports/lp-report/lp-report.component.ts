/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
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
  selector: 'app-lp-report',
  templateUrl: './lp-report.component.html',
  styleUrls: ['./lp-report.component.scss'],
})
export class LpReportComponent implements OnInit {
  data: any;
  displayedColumns = [
    'lpName',
    'bu',
    'courses',
    'users',
    'cmp_days',
    'lp_threshold',
    'status',
  ];
  lpsList = [];
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.data = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        const navigation = this.router.url;

        this.lpList();
      }
    });
  }

  ngOnInit() {}

  lpList() {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading LP list...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.lpsList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));

    this.service.lp_list(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const lp = {
            lp_id: element.lp_id,
            lp_name: element.lp_name,
            lp_bu: element.lp_bu,
            lp_courses_cnt: element.lp_courses_cnt,
            lp_users_cnt: element.lp_users_cnt,
            lp_days: element.lp_days,
            lp_threshold: element.lp_threshold,
            lp_status: element.lp_status,
          };
          this.lpsList.push(lp);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.lpsList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ionViewDidEnter() {
    this.dataSource.paginator = this.paginator;
  }

  navMenu(action: any, lpId: any) {
    if (action === 'edit') {
      this.navCtrl.navigateForward('home/create-lp?id=' + lpId);
    } else if (action === 'mg-courses') {
      this.navCtrl.navigateForward('home/lp-courses?id=' + lpId);
    } else if (action === 'lpsummary') {
      this.navCtrl.navigateForward('home/lp-summary?id=' + lpId);
    } else if (action === 'mg-users') {
      this.navCtrl.navigateForward('home/lp-users?id=' + lpId);
    }
  }
}
