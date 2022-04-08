import { GlobalApiService } from './../../services/global-api.service';
import { Component, OnInit, ViewChildren,QueryList,HostListener, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { NavController,LoadingController } from '@ionic/angular';


export interface CatCourses {
 
  categoryId: number;
  categoryName: string;
  categoryCourses: [];
}

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit {

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  
  
  innerWidth: number;
  courses: any = [];
  categories: any = [];
  summary: string;
  catCrs: CatCourses[] = [];
  coursesDummy: any = [];
  allCourses: any = [];
  allCoursesDummy: any = [];

  slideOpts = {
    slidesPerView: 0,
    Navigator:true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 0,
      slideShadows: true,
    }
  }



  carouselOptions = {
    margin: 25,
    nav: true,
    navText: ["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true
      },
      600: {
        items: 1,
        nav: true
      },
      1000: {
        items: 4,
        nav: true,
        loop: false
      },
      1500: {
        items: 5,
        nav: true,
        loop: false
      }
    }
  }
  IonSlides: any;
  



  constructor(private service: GlobalApiService, private route: Router,
    public loadingController: LoadingController, private router: ActivatedRoute,private navCtrl: NavController) { }


  ngOnInit() {
    this.onResize();


    
    this.router.queryParams.subscribe(
      params => {
        this.loadCourse();    
      }
    )

    
  }

  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      
      this.slideOpts.slidesPerView = 1;
    } else {
      
      this.slideOpts.slidesPerView = 4;
    }
  }

  ionViewDidEnter() {
    //this.navMenu();
  }
  

  navMenu() {
      this.navCtrl.navigateForward('/home/courses',{queryParams: {load: true}});
    }
  loadCourse() {
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));

    this.service.lc_mod_get_enrol_courses(data).subscribe(
      res => {

        this.courses = res.Data;
        console.log(JSON.stringify(this.courses));
        this.coursesDummy = this.courses;
        this.courses.forEach(element => {
          if (element.overviewfiles.length != 0) {
            Object.assign(element, { imgUrl: element.overviewfiles[0].fileurl + '?token=' + localStorage.getItem('user_key') });
          } else {
            Object.assign(element, { imgUrl: './assets/icon/crs-img.jpg' });
          }
        });

      }, err => {
        console.log(err);
      }
    );
  }


  getCourseDetails(id,course,credits,status) {

    this.route.navigate(['home/teacher/course-summary'], { queryParams: { id: id,status:status,credits: credits,course: course, } });


  }

  search(value: any): void {


    this.courses = this.coursesDummy.filter(item => item.fullname.search(new RegExp(value, 'i')) > -1);

    //console.log(JSON.stringify(this.courses));

  }

  searchAllCourse(value: any): void {


    this.allCourses = this.allCoursesDummy.filter(item => item.fullname.search(new RegExp(value, 'i')) > -1);

    //console.log(JSON.stringify(this.courses));

  }

  // Hide the loader if already created otherwise return error
  hideLoader_1() {
    this.loadingController.dismiss().then((res) => {
    }).catch((error) => {
    });
  }


  // Show the loader for infinite time

  // Show the loader for infinite time
  showLoader_1() {
    this.loadingController.create({
      message: 'loading, Please Wait ...'
    }).then((res) => {
      res.present();
    });
  }

  onScrollDown() {
    alert();
    console.log('scrolled!!');
  }

  

  next(count) {
    
    let i = 0;
      this.slides.forEach(element => {
        
       if(i == count){
       
        
        element.slideNext();
        
       }
        i++;
      })    
  }

  prev(count) {
    
    let i = 0;
      this.slides.forEach(element => {
       if(i == count){
        
        element.slidePrev();
       }
        i++;
      })    
  }

  

}
