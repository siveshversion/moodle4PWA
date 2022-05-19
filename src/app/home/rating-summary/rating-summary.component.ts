/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { GlobalApiService } from 'src/app/services/global-api.service';

interface RatingResponse {
  username: string;
  title: string;
  comments: string;
  ratingnumber: number;
}

@Component({
  selector: 'app-rating-summary',
  templateUrl: './rating-summary.component.html',
  styleUrls: ['./rating-summary.component.scss'],
})
export class RatingSummaryComponent implements OnInit {
  ratingForm: FormGroup;
  cId: any;
  ratings: any;
  alreadySubmitted: number;
  submissions: number;
  submittedResponse: RatingResponse[] = [];

  constructor(
    private service: GlobalApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.setformValidators();

    this.route.queryParams.subscribe((params) => {
      this.ratingForm.reset();
      if (params.id) {
        this.cId = params.id;
        this.getReviews();
      }
    });
  }

  setformValidators() {
    this.ratingForm = this.formBuilder.group({
      review_headline: new FormControl('', null),
      reviewDesc: new FormControl('', null),
      ratings: new FormControl('', Validators.required),
    });
  }

  async showCustomAlert(msg) {
    const alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['home/coursesummary'], {
              queryParams: { cid: this.cId },
            });
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  // Show the loader for infinite time
  showLoader(msg: any) {
    this.loadingController
      .create({
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }

  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingController
      .dismiss()
      .then((res) => {})
      .catch((error) => {});
  }

  submit() {
    const formData = new FormData();
    formData.append('rating', this.ratingForm.get('ratings').value);
    formData.append(
      'review_headline',
      this.ratingForm.get('review_headline').value
    );
    formData.append('reviewDesc', this.ratingForm.get('reviewDesc').value);
    formData.append('userid', localStorage.getItem('user_id'));
    formData.append('cid', this.cId);
    this.showLoader('Submiting Review');
    this.service.saveReview(formData).subscribe(
      (res) => {
        if (res.Data) {
          const msg = 'Review Submitted Successfully';
          this.showCustomAlert(msg);
          this.hideLoader();
        }
      },
      (err) => {
        console.log(err);
        this.hideLoader();
      }
    );
  }

  getReviews() {
    const formData = new FormData();
    formData.append('cid', this.cId);
    formData.append('userid', localStorage.getItem('user_id'));
    const msg = 'Loading Reviews';
    this.showLoader(msg);
    this.service.getReviews(formData).subscribe(
      (res) => {
        if (res.Data) {
          this.alreadySubmitted = res.Data.submitted;
          this.submissions = res.Data.submissions;
          this.submittedResponse = res.Data.response;
          this.hideLoader();
        }
      },
      (err) => {
        console.log(err);
        this.hideLoader();
      }
    );
  }
}
