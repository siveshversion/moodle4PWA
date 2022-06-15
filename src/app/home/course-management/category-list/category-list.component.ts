/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
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
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  data: any;
  displayedColumns = ['categoryName', 'coursesCount', 'Action'];
  categorysList = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
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
    private navCtrl: NavController
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((params) => {
      this.categoryList();
    });
  }

  ngOnInit() {}

  categoryList() {
    this.searchVal.nativeElement.value = '';
    const msg = 'Loading Category list...<br> Please wait...';
    this.loader.showAutoHideLoader(msg);

    this.categorysList = [];

    const data = new FormData();
    data.append('userId', localStorage.getItem('user_id'));

    this.service.category_list(data).subscribe(
      (res) => {
        res.Data.forEach((element: any) => {
          const cnt = Number(element.category_courses_cnt);
          const course_exist = cnt > 0 ? true : false;

          const category = {
            category_id: element.category_id,
            category_name: element.category_name,
            category_courses_cnt: element.category_courses_cnt,
            category_course_exist: course_exist,
          };
          this.categorysList.push(category);
        });
        this.applyFilter('');
      },
      (err) => {
        console.log(err);
      }
    );

    this.dataSource = new MatTableDataSource<any>(this.categorysList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ionViewDidEnter() {
    this.dataSource.paginator = this.paginator;
  }

  navMenu(action: any, catId: any) {
    if (action === 'edit') {
      this.navCtrl.navigateForward('home/categorycreation?id=' + catId);
    } else if (action === 'view') {
      this.navCtrl.navigateForward('home/courses?cat=' + catId);
    } else if (action === 'add') {
      this.navCtrl.navigateForward('home/coursecreation?cat=' + catId);
    }
  }
}
