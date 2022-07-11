/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { GlobalApiService } from 'src/app/services/global-api.service';
@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent implements OnInit, OnChanges {
  @Input() screenWidth: number;

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  badges: any = [];
  loading = true;
  isEmpty = false;

  slideOpts = {
    slidesPerView: 1,
    Navigator: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 0,
      slideShadows: true,
    },
    breakpoints: {
      150: {
        slidesPerView: 1,
      },
      340: {
        slidesPerView: 1,
      },
      440: {
        slidesPerView: 3,
      },
      668: {
        slidesPerView: 5,
      },
      768: {
        slidesPerView: 6,
      },
      950: {
        slidesPerView: 12,
      },
    },
  };

  IonSlides: any;

  constructor(private service: GlobalApiService, private route: Router) {}

  ngOnInit() {
    this.getBadges();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getBadges() {
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));
    this.service.get_badges(data).subscribe(
      (res) => {
        this.badges = res.Data.badges;
        this.isEmpty = res.Data.empty;
        this.loading = false;
        res.Data.badges.forEach((element: any) => {
          console.log(JSON.stringify(element));
        });
      },
      (err) => {
        console.log(err);
      }
    );
    return null;
  }

  next(count) {
    let i = 0;
    this.slides.forEach((element) => {
      if (i == count) {
        element.slideNext();
      }
      i++;
    });
  }

  prev(count) {
    let i = 0;
    this.slides.forEach((element) => {
      if (i == count) {
        element.slidePrev();
      }
      i++;
    });
  }
  goToCourse(courseid) {
    this.route.navigate(['home/course'], {
      queryParams: { id: courseid, type: 'course' },
    });
  }
}
