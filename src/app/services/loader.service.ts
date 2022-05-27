import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(public loadingController: LoadingController) {}

  showAutoHideLoader(msg: string) {
    this.loadingController
      .create({
        message: msg,
        duration: 2000
      })
      .then((res) => {
        res.present();
      });
  }

}
