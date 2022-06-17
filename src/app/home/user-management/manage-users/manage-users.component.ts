/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

export interface Users {
  id: any;
  firstname: string;
  lastname: string;
  createdon: string;
  lastaccess: string;
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit {
  userList = [];
  users: any = [];
  data: any;

  role: any;
  buName: any;
  dataSource: any;
  displayedColumns = [
    'UserId',
    'FirstName',
    'LastName',
    'BuName',
    'DateofCreation',
    'LastAccess',
    'Action',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('searchVal', { static: true }) searchVal: ElementRef;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.role = localStorage.getItem('role');
    this.route.queryParams.subscribe((params) => {
      if (localStorage.getItem('role') === 'manager') {
        this.buName = localStorage.getItem('buName');
        this.getUserList('');
      } else if (params.buId) {
        this.getUserList(params.buId);
        this.buName = null;
      } else {
        this.buName = null;
        this.getUserList('');
      }
    });
  }

  ngOnInit() {}

  getUserList(buId: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading User list...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);
    this.userList = [];

    let ToggleIcon: string;
    let ToggleTitle: string;
    const data = new FormData();
    data.append('wstoken', environment.MOODLE_TOKEN);
    if (localStorage.getItem('buId')) {
      data.append('buId', localStorage.getItem('buId'));
    } else if (buId) {
      data.append('buId', buId);
    }
    this.service.mod_get_user_list(data).subscribe(
      (res) => {
        this.users = res.Data;
        this.users.forEach((element: any) => {
          const suspended = element.suspended;
          if (suspended == '0') {
            ToggleIcon = 'person';
            ToggleTitle = 'Suspend';
          } else if (suspended == '1') {
            ToggleIcon = 'person_off';
            ToggleTitle = 'Activate';
          }
          const stud = {
            id: element.userid,
            username: element.username,
            firstname: element.firstname,
            lastname: element.lastname,
            buName: element.buName,
            createdon: element.createdon,
            lastaccess: element.lastaccess,
            suspended: element.suspended,
            toggleIcon: ToggleIcon,
            toggleTitle: ToggleTitle,
          };
          this.userList.push(stud);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.userList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navMenu(routeName: string, user_id: number) {
    if (routeName === 'users') {
      this.navCtrl.navigateForward('/home/users');
    } else if (routeName === 'user-registration') {
      this.navCtrl.navigateForward('/home/usercreation', {
        queryParams: { id: user_id },
      });
    }
  }

  suspend(userid: any, mode: any) {
    let msg = 'Processing Request...';
    this.loader.showAutoHideLoader(msg);
    const formData = new FormData();
    mode = mode == '1' ? '0' : '1';
    const status = mode == '0' ? ' Activated ' : ' Suspended ';
    formData.append('user_id', userid);
    formData.append('mode', mode);
    this.service.mod_suspend_user(formData).subscribe(
      (response) => {
        if (response) {
          msg = 'User' + status + 'Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  delete(userid: any) {
    let msg = 'Processing Request...';
    this.loader.showAutoHideLoader(msg);
    const formData = new FormData();
    formData.append('user_id', userid);
    this.service.mod_delete_user(formData).subscribe(
      (response) => {
        if (response.Data) {
          msg = 'User Deleted successfully';
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
            this.getUserList('');
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }
}
