import { Router } from '@angular/router';
import { Component, ElementRef, HostListener } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { GlobalApiService } from '../services/global-api.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [TranslateService]
})
export class HomePage {

  innerWidth: number;
  hamburgFlag = false;

  constructor(
    private route: Router,
    private menu: MenuController,
    private navCtrl: NavController,
    private storage: Storage,
    private alert: AlertController,
    private service: GlobalApiService,
    private translateService: TranslateService,
    private elRef: ElementRef,) {
      this.translateService.setDefaultLang('en');
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

  }

  ngOnInit(){
    this.elRef.nativeElement.style.setProperty('--selectedColorCode', '#1B1B1B');
    this.elRef.nativeElement.style.setProperty('--background', '#1B1B1B');
    this.elRef.nativeElement.style.setProperty('--selectedFontColor', '#94a0ad');
    this.elRef.nativeElement.style.setProperty('--color', '#94a0ad');
  }

  navMenu(routeName: any) {
    if(routeName == 'users'){
      this.navCtrl.navigateForward('/home/users');
    } else if(routeName == 'add-new-user'){
      this.navCtrl.navigateForward('/home/usercreation');
    }
  }

  stickyMenu() {
    this.menu.getOpen();
  }

}
