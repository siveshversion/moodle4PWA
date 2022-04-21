import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-lp-summary',
  templateUrl: './lp-summary.component.html',
  styleUrls: ['./lp-summary.component.scss'],
})
export class LpSummaryComponent implements OnInit {

  lpId: any;
  lp: any;

  constructor(private service: GlobalApiService, private sanitizer: DomSanitizer, private router: ActivatedRoute, public loadingController: LoadingController, private route: Router, private translateService: TranslateService, private formBuilder: FormBuilder, private navCtrl: NavController) {
    this.translateService.setDefaultLang('en');
    this.router.queryParams.subscribe(
      params => {
        this.showLoader('Loading LP details');
        this.lpId = params.id;
        this.lp_details();
      }

    );
  }

  ngOnInit() { }
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

  lp_details() {
    const lpData = new FormData();

    lpData.append('lp_id', this.lpId);
    this.service.mod_get_lp_details(lpData).subscribe(
      res => {
        this.lp = res.Data;
        // alert(localStorage.getItem('user_key'));
        //console.log(JSON.stringify(this.details));

        this.hideLoader();
      },
      err => {
        console.log(err);

      }
    );

  }

  navMenu(action: any, lpId: any) {
    if (action === 'mg-courses') {
      this.navCtrl.navigateForward('home/lp-courses?id=' + lpId);
    }
  }


  ordering(lp_id: any) {

  }


}
