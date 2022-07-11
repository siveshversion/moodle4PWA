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
  selector: 'app-certs',
  templateUrl: './certs.component.html',
  styleUrls: ['./certs.component.scss'],
})
export class CertsComponent implements OnInit,OnChanges {
  @Input() screenWidth: number;

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  certs: any = [];
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
        slidesPerView: 12
      }
    },
  };

  IonSlides: any;

  constructor(private service: GlobalApiService,private route: Router) {}

  ngOnInit() {
    this.getCerts();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getCerts() {
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));
    this.service.get_certs(data).subscribe(
      (res) => {
        this.certs = res.Data.certs;
        this.isEmpty = res.Data.empty;
        this.loading = false;
        res.Data.certs.forEach((element: any) => {
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
    this.route.navigate(['home/course-content'], { queryParams: { id: courseid , type: 'cert' } });
  }
}
