/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
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
  selector: 'app-bu-courses',
  templateUrl: './bu-courses.component.html',
  styleUrls: ['./bu-courses.component.scss'],
})
export class BuCoursesComponent implements OnInit {
  data: any;
  displayedColumns = [
    'sNo',
    'courseName',
    'courseShortName',
    'categoryName',
    'Action',
  ];
  coursesList = [];
  courseFilter = [
    { value: 'all', viewValue: 'All' },
    { value: 'assigned', viewValue: 'Assigned' },
    { value: 'not_assigned', viewValue: 'Unassigned' },
  ];
  selectedFilter: any;
  buid: any;

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
        this.buid = params.id;
        this.selectedFilter = 'all';
        this.viewCourses(this.buid);
      }
    });
  }

  ngOnInit() {}

  viewCourses(buid: any) {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading Courses...<br>Please wait';
    this.loader.showAutoHideLoader(msg);
    this.coursesList = [];

    const data = new FormData();
    data.append('bu_id', buid);
    data.append('assign_status', this.selectedFilter);

    this.service.bu_courses(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const course = {
            sl_no: element.sl_no,
            course_id: element.course_id,
            course_name: element.course_fullname,
            course_short_name: element.course_shortname,
            category_name: element.category_name,
            category_id: element.category_id,
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


  unassignCourse(cid: any) {
    const msg = 'Processing Request..';
    this.loader.showAutoHideLoader(msg);

    const data = new FormData();
    data.append('bu_id', this.buid);
    data.append('course_id', cid);

    this.service.remove_course_from_bu(data).subscribe(
      (res) => {
        const m = 'Course Unassigned Successfully';
        this.showAlert(m, this.buid);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async assignCourse(cid: any) {
    const msg = 'Processing Request..';
    this.loader.showAutoHideLoader(msg);
    const data = new FormData();
    data.append('bu_id', this.buid);
    data.append('course_id', cid);
    data.append('userId', localStorage.getItem('user_id'));

    this.service.add_course_to_BU(data).subscribe(
      (res) => {
        if (res.Data.buc_id) {
          const m = 'Course Assigned Successfully';
          this.showAlert(m, this.buid);
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

  async showAlert(msg: string, buid: any) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.viewCourses(buid);
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  selectFilter(value: any) {
    this.selectedFilter = value;
    this.viewCourses(this.buid);
  }

  navMenu(action: any, courseId: any) {
    if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + courseId);
    }
  }
}
