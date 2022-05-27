/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-lp-summary',
  templateUrl: './lp-summary.component.html',
  styleUrls: ['./lp-summary.component.scss'],
})
export class LpSummaryComponent implements OnInit {
  lpId: any;
  lp: any;
  dynamicClass = 'lc-section-custom';
  dyamicBtnLabel = 'Set Order';

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private router: ActivatedRoute,
    public loadingController: LoadingController,
    private route: Router,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) {
    this.translateService.setDefaultLang('en');
    this.router.queryParams.subscribe((params) => {
      const msg = 'Loading LP details';
      this.loader.showAutoHideLoader(msg);
      this.lpId = params.id;
      this.lp_details();
    });
  }

  ngOnInit() {}

  lp_details() {
    const lpData = new FormData();

    lpData.append('lp_id', this.lpId);
    this.service.mod_get_lp_details(lpData).subscribe(
      (res) => {
        this.lp = res.Data;
        // alert(localStorage.getItem('user_key'));
        //console.log(JSON.stringify(this.details));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  navMenu(action: any, mappedId: any) {
    if (action === 'mg-courses') {
      this.navCtrl.navigateForward('home/lp-courses?id=' + mappedId);
    } else if (action === 'course-summary') {
      this.navCtrl.navigateForward('home/coursesummary?cid=' + mappedId);
    }
  }

  ordering() {
    if (this.dynamicClass === 'lc-section-move') {
      this.processSorting();
      this.dyamicBtnLabel = 'Set Order';
      this.dynamicClass = 'lc-section-custom';
    } else {
      this.dyamicBtnLabel = 'Done';
      this.dynamicClass = 'lc-section-move';
    }
  }

  processSorting() {
    const formData = new FormData();
    formData.append('lp_id', this.lpId);
    if (this.lp.coursesarr.length > 0) {
      formData.append('courses_arr', JSON.stringify(this.lp.coursesarr));
    }
    this.service.lp_course_sorting(formData).subscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.lp.coursesarr,
      event.previousIndex,
      event.currentIndex
    );
  }
}
