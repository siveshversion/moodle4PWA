import { element } from 'protractor';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  catalogs: any = [];
  catalogsDummy: any = [];
  innerWidth: number;

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

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      this.loadCatalog();
      this.onResize();
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.slideOpts.slidesPerView = 1;
    } else {
      this.slideOpts.slidesPerView = 4;
    }
  }

  loadCatalog() {
    const msg = 'Loading, Please Wait ...';
    this.loader.showAutoHideLoader(msg);
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));

    this.service.get_catalog(data).subscribe(
      (res) => {
        this.catalogs = res.Data;
        console.log(JSON.stringify(this.catalogs));
        this.catalogsDummy = this.catalogs;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCatalogDetails(id) {
    this.route.navigate(['home/course'], {
      queryParams: { id, type: 'course' },
    });
  }

  next(nth_slide: number) {
    const nSlides = this.slides.toArray();
    const nthSlide = nSlides[nth_slide];
    nthSlide.slideNext();
  }

  prev(nth_slide: number) {
    const nSlides = this.slides.toArray();
    const nthSlide = nSlides[nth_slide];
    nthSlide.slidePrev();
  }
}
