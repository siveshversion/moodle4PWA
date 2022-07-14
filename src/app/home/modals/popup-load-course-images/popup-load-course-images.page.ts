import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalApiService } from 'src/app/services/global-api.service';

@Component({
  selector: 'app-popup-load-course-images',
  templateUrl: './popup-load-course-images.page.html',
  styleUrls: ['./popup-load-course-images.page.scss'],
})
export class PopupLoadCourseImagesPage implements OnInit {

  cimages: any = [];
  loading = true;
  isEmpty = false;

  constructor(private modalController: ModalController, private service: GlobalApiService) { }

  ngOnInit() {
    this.getCerts();
  }

  getCerts() {
    const data = new FormData();
    data.append('userid', localStorage.getItem('user_id'));
    this.service.get_course_Image_defaults(data).subscribe(
      (res) => {
        this.cimages = res.Data.cimages;
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

  async closeModal() {
    await this.modalController.dismiss();
    // this.router.navigateByUrl('login');
  }

}
