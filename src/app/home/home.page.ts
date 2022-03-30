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
    private elRef: ElementRef,) {}

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

  navMenu(routeName: any) {
    localStorage.setItem('plan_expired', '0');
    const today = new Date();
    if (localStorage.getItem('recent_txnToken') != '') {
      this.navCtrl.navigateForward('/home/dashboard', { queryParams: { dashboard: 2 } });
    } else {
      this.navCtrl.navigateForward('/home/dashboard');
    }
  }

  stickyMenu() {
    this.menu.getOpen();
  }

}
