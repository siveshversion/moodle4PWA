/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-learner-lps',
  templateUrl: './learner-lps.component.html',
  styleUrls: ['./learner-lps.component.scss'],
})
export class LearnerLPsComponent implements OnInit {

  lps: any = [];
  lpsDummy: any = [];

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  option = {
    startVal: 0,
    useEasing: true,
    duration: 1,
  };

  slideOpts = {
    slidesPerView: 0,
    Navigator: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 0,
      slideShadows: true,
    },
  };

  IonSlides: any;

  constructor(    private service: GlobalApiService,
    private loader: LoaderService,
    private route: Router,
    private router: ActivatedRoute) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      this.loadLP();
  });
  }

  loadLP() {
    const msg = 'Loading, Please Wait ...';
    this.loader.showAutoHideLoader(msg);
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));

    this.service.mod_get_enrol_lps(data).subscribe(
      (res) => {
        this.lps = res.Data;
        console.log(JSON.stringify(this.lps));
        this.lpsDummy = this.lps;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLPDetails(id) {
    this.route.navigate(['home/lp-summary'], {
      queryParams: { id },
    });
  }

  search(target: any, type: any): void {
    if (type === 'lps') {
      this.lps = this.lpsDummy.filter(
        (item) => item.lpname.search(new RegExp(target.value, 'i')) > -1
      );
    }
    //console.log(JSON.stringify(this.lps));
  }

  next(count) {
    let i = 0;
    this.slides.forEach((element) => {
      // eslint-disable-next-line eqeqeq
      if (i == count) {
        element.slideNext();
      }
      i++;
    });
  }

  prev(count) {
    let i = 0;
    this.slides.forEach((element) => {
      // eslint-disable-next-line eqeqeq
      if (i == count) {
        element.slidePrev();
      }
      i++;
    });
  }


}
