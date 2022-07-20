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
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lp-courses-report',
  templateUrl: './lp-courses-report.component.html',
  styleUrls: ['./lp-courses-report.component.scss'],
})
export class LpCoursesReportComponent implements OnInit {
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
  role: any;
  buName: any;
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
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((params) => {
      this.lpCourseList(params.id);
      this.role = localStorage.getItem('role');
      this.buName = localStorage.getItem('buName');
    });
  }

  ngOnInit() {}

  lpCourseList(lpid: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading LP list...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.lpsList = [];

    const data = new FormData();
    data.append('lpId', lpid);
    data.append('userId', localStorage.getItem('user_id'));
    data.append('buId', localStorage.getItem('buId'));

    this.service.LPCoursesReport(data).subscribe(
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
