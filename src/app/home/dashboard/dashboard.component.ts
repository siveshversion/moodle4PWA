import { GlobalApiService } from './../../services/global-api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private service: GlobalApiService, private navCtrl: NavController, public loadingController: LoadingController, private router: ActivatedRoute, private translateService: TranslateService, private route: Router) {

    this.translateService.setDefaultLang('en');
  }

  ngOnInit() { }

}
