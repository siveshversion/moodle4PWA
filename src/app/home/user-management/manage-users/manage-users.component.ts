import { GlobalApiService } from './../../../services/global-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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

  userList=[];
  users:any =[];

  dataSource: any;
  displayedColumns = ['UserId', 'FirstName', 'LastName','DateofCreation', 'LastAccess', 'Action'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private service: GlobalApiService, public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient, private route:Router,
    private translateService:TranslateService) {
        this.translateService.setDefaultLang('en');
      }
  ngOnInit() {
    this.getUserList();
  }
  getUserList() {


    //this.showLoader('Loading Student list...<br> Please wait...');

    this.userList = [];

    let ToggleIcon: string;
    let ToggleTitle: string;
    const data = new FormData();
    // data.append('wstoken', environment.MOODLE_TOKEN);

    this.service.lc_mod_get_user_list(data).subscribe(
      res => {
        this.users = res.Data;
        this.users.forEach((element: any) => {
          let suspended = element.suspended;
          if (suspended == '0') {
            ToggleIcon = 'person';
            ToggleTitle = 'suspend';
          }
          else if (suspended == '1') {
            ToggleIcon = 'person_off';
            ToggleTitle = 'activate';
          }
          const stud = {
            id: element.userid,
            username: element.username,
            firstname: element.firstname,
            lastname: element.lastname,
            createdon: element.createdon,
            lastaccess: element.lastaccess,
            suspended: element.suspended,
            toggleIcon: ToggleIcon,
            toggleTitle: ToggleTitle
          };
          this.userList.push(stud);
        });
        this.applyFilter('');
        this.hideLoader();
      }, err => {
        console.log(err);
        this.hideLoader();
      });

    this.dataSource = new MatTableDataSource<any>(this.userList);
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  navMenu(routeName: string, user_id: number) {
    if (routeName === 'users') {
      this.route.navigateByUrl('users');
    }
  }


  suspend(userid: any, mode: any) {
    this.showLoader('Processing Request...');
    let formData = new FormData();
    mode = (mode == '1') ? '0' : '1';
    let status = (mode == '0') ? ' Activated ' : ' Suspended ';
    formData.append("student_id", userid);
    formData.append("mode", mode);
    // this.service.lc_mod_suspend_student(formData).subscribe((response) => {
    //   if (response) {
    //     this.hideLoader();
    //     let msg = "User" + status + "Successfully"
    //     this.showAlert(msg);
    //   }
    // }, err => {
    //   console.log(err);
    //   this.hideLoader();
    // });
  }


  delete(userid: any) {
    this.showLoader('Processing Request...');
    let formData = new FormData();
    formData.append("student_id", userid);
    // this.service.lc_mod_delete_student(formData).subscribe((response) => {
    //   if (response) {
    //     this.hideLoader();
    //     let msg = 'Student Deleted successfully';
    //     this.showAlert(msg);
    //   }
    // }, err => {
    //   console.log(err);
    //   this.hideLoader();
    // });
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


}
