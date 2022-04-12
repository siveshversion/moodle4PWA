import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, ElementRef, HostListener } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { GlobalApiService } from '../services/global-api.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [TranslateService, Storage]
})
export class HomePage {

  innerWidth: number;
  hamburgFlag = false;
  loginDetails: any = '';
  cancel_text: string;
  logout_text: string;
  title_text: string;
  msg: string;
  role: string;
  isAdmin: Boolean;
  isStudent: Boolean;

  constructor(
    private routea: ActivatedRoute,
    private route: Router,
    private menu: MenuController,
    private navCtrl: NavController,
    private storage: Storage,
    private acroute: ActivatedRoute,
    public alertCtrl: AlertController,
    private service: GlobalApiService,
    private translateService: TranslateService,
    private elRef: ElementRef) {
    this.onResize();

    this.routea.params.subscribe((params) => {
      this.translateService.setDefaultLang('en');
      this.role = localStorage.getItem('role');
      if (this.role === 'admin') {
        this.isAdmin = true;
        this.isStudent = false;
      }
      else {
        this.isStudent = true;
        this.isAdmin = false;
      }
      let navigation = this.route.url;
        if (navigation === '/home') {
          this.route.navigateByUrl('home/dashboard');
        }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1024) {
      this.hamburgFlag = true;
    } else {
    }
  }

  logout() {
    this.showAffirmativeAlert();
  }


  ngOnInit() {
    this.elRef.nativeElement.style.setProperty('--selectedColorCode', '#1B1B1B');
    this.elRef.nativeElement.style.setProperty('--background', '#1B1B1B');
    this.elRef.nativeElement.style.setProperty('--selectedFontColor', '#94a0ad');
    this.elRef.nativeElement.style.setProperty('--color', '#94a0ad');
  }

  navMenu(routeName: any) {
    if (routeName == 'users') {
      this.navCtrl.navigateForward('/home/users');
    } else if (routeName == 'add-new-user') {
      this.navCtrl.navigateForward('/home/usercreation');
    } else if (routeName == 'dashboard') {
      this.navCtrl.navigateForward('/home/dashboard');
    } else if (routeName == 'add-new-category') {
      this.navCtrl.navigateForward('/home/categorycreation');
    } else if (routeName == 'category-list') {
      this.navCtrl.navigateForward('/home/categories');
    } else if (routeName == 'course-list') {
      this.navCtrl.navigateForward('/home/courses');
    } else if (routeName == 'add-new-course') {
      this.navCtrl.navigateForward('/home/coursecreation');
    } else if (routeName == 'courseparticipants') {
      this.navCtrl.navigateForward('/home/course-manage-users');
    }else if (routeName == 'mycourses') {
      this.navCtrl.navigateForward('/home/mycourses');
    }else if (routeName == 'course') {
      this.navCtrl.navigateForward('/home/course');
    }
  }

  ionViewDidEnter() {
    // this.storage.get('user').then((val) => {
    //   this.loginDetails = JSON.parse(val);
    //   if (val.profileimageurlsmall === null || val.profileimageurlsmall == '') {
    //     this.loginDetails.profileimageurlsmall = './assets/icon/user-8.png';
    //   }

    // });
    let uname = localStorage.getItem('username');
    this.loginDetails = {
      fullname: uname
    };

    this.onResize();
  }

  stickyMenu() {
    this.menu.getOpen();
  }

  async showAffirmativeAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Logout?',
      message: '',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancel',
        handler: () => {
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.route.navigateByUrl('login');
        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }


}
