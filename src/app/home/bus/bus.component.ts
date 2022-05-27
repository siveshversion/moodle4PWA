/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
})
export class BUsComponent implements OnInit {
  data: any;
  displayedColumns = ['bu', 'courses', 'users', 'Action'];
  busList = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

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

    this.data = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        const navigation = this.router.url;
        if (navigation === '/home/bus') {
          this.buList();
        }
      }
    });
  }

  ngOnInit() {}

  buList() {
    const msg = 'Loading BU list...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.busList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));

    this.service.bu_list(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const bu = {
            bu_id: element.bu_id,
            bu_name: element.bu_name,
            bu_courses_cnt: element.bu_courses_cnt,
            bu_users_cnt: element.bu_users_cnt,
          };
          this.busList.push(bu);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.busList);
    this.dataSource.paginator = this.paginator;
  }

  delete(bu_id: any) {
    let msg = 'Processing Request..';
    this.loader.showAutoHideLoader(msg);
    const formData = new FormData();
    formData.append('bu_id', bu_id);
    this.service.delete_BU(formData).subscribe(
      (response) => {
        if (response.Data) {
          msg = 'BU Deleted successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.buList();
          },
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


  navMenu(action: any, buId: any) {
    if (action === 'edit') {
      this.navCtrl.navigateForward('home/create-bu?id=' + buId);
    } else if (action === 'mg-courses') {
      this.navCtrl.navigateForward('home/bu-courses?id=' + buId);
    } else if (action === 'busummary') {
      this.navCtrl.navigateForward('home/bu-summary?id=' + buId);
    } else if (action === 'mg-users') {
      this.navCtrl.navigateForward('home/bu-users?id=' + buId);
    }
  }

  createBU() {
    this.navCtrl.navigateForward('home/create-bu)');
  }
}
