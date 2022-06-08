import { LoaderService } from 'src/app/services/loader.service';
import { GlobalApiService } from 'src/app/services/global-api.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [GlobalApiService, Storage],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordIcon: any;
  passType: any;

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private router: Router,
    private service: GlobalApiService,
    private loader: LoaderService,
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
    private modalController: ModalController,
    private menu: MenuController,
    private elRef: ElementRef
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    if (localStorage.getItem('user_id')) {
      this.router.navigateByUrl('home');
    }

    this.passwordIcon = 'eye-off';
    this.passType = 'password';

    this.storage.create();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPassword() {
    this.passwordIcon = this.passwordIcon === 'eye' ? 'eye-off' : 'eye';
    this.passType = this.passType === 'password' ? 'text' : 'password';
  }

  hasError(controlName: string, validation: string, index: any) {
    return this.loginForm.get(controlName).hasError(validation);
  }

  onSubmit() {
    const msg = 'Logging In Please Wait ...';
    this.loader.showAutoHideLoader(msg);

    this.service.login_svc(this.loginForm.value).subscribe(
      (res) => {
        console.log(JSON.stringify(res));
        if (res.Data.result === 1) {
          localStorage.setItem('username', this.loginForm.value.username);
          localStorage.setItem('password', this.loginForm.value.password);
          localStorage.setItem('user_key', res.Data.token);
          localStorage.setItem('user_id', res.Data.userid);
          localStorage.setItem('role', res.Data.role);
          if(res.Data.role ==='manager') {
            localStorage.setItem('buId',res.Data.buId);
            localStorage.setItem('buName',res.Data.buName);
          }
          // alert(res.Data.role);
          this.router.navigateByUrl('home');
        } else {
          this.showAlert(res.Data.message);
        }
      },
      (err) => {
        this.showAlert('LMS Offline');
        console.log(err);
      }
    );
  }

  async showAlert(message) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message,
      buttons: [
        {
          text: 'OK',
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }
}
