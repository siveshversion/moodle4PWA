import { GlobalApiService } from './../../../services/global-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})


export class CourseListComponent implements OnInit {

  data: any;
  displayedColumns = ['courseName', 'categoryName','Action'];
  coursesList = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private service: GlobalApiService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient, private router:
      Router, private navCtrl: NavController) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.data = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        let navigation = this.router.url;
        if (navigation === '/home/courses') {
          this.courseList();
        }
      }
    });

  }

  ngOnInit() { }


  courseList() {

    //this.showLoader('Loading course list...<br> Please wait...');

    this.coursesList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));

    this.service.lc_course_list(data).subscribe(
      res => {

        res.Data.forEach((element: any) => {

          let cnt = Number(element.course_courses_cnt);
          let course_exist = (cnt > 0) ? true : false;

          const course = {
            course_id: element.course_id,
            course_name: element.course_fullname,
            category_name: element.category_name,
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


  navMenu(action: any, catId: any) {
    if (action === 'edit') {
      this.navCtrl.navigateForward('home/coursecreation?id=' + catId);
    }
    else if (action === 'view') {
      this.navCtrl.navigateForward('home/course-list?id=' + catId);
    }  else if (action === 'add') {
      this.navCtrl.navigateForward('home/add-course?catid=' + catId);
    }

  }

}
