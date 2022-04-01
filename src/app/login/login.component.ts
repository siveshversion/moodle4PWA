import { GlobalApiService } from './../services/global-api.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [GlobalApiService,Storage]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  passwordIcon: any;
  passType: any;

  constructor(private translate: TranslateService,
    private formBuilder: FormBuilder,
    private storage: Storage, 
    private router: Router, 
    private service: GlobalApiService,
    public alertCtrl: AlertController, 
    private route: ActivatedRoute,
    public loadingController: LoadingController, 
    private modalController: ModalController,
    private menu: MenuController,
    private elRef: ElementRef,) { 
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.passwordIcon = 'eye-off';
    this.passType = 'password';

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hideShowPassword() {
    this.passwordIcon = (this.passwordIcon === 'eye') ? 'eye-off' : 'eye';
    this.passType = (this.passType === 'password') ? 'text' : 'password';
  }

  hasError(controlName: string, validation: string, index: any) {
    return this.loginForm.get(controlName).hasError(validation);
  }

  onSubmit() {

    this.showLoader();

    this.service.lc_login_svc(this.loginForm.value).subscribe(
      res => {

        console.log(JSON.stringify(res));
        this.hideLoader();
        if (res.Data.result == 1) {
          localStorage.setItem('username', (this.loginForm.value).username);
          localStorage.setItem('password', (this.loginForm.value).password);
          localStorage.setItem('user_key', res.Data.token);
          localStorage.setItem('user_id', res.Data.userid);
          localStorage.setItem('role', res.Data.role);

          this.router.navigateByUrl('home');

        //  this.getUserDetails();

        } else {
          this.showAlert('Wrong username or password. Please try again.');
        }
      },
      err => {
        this.showAlert('LMS Offline');
        this.hideLoader();

        console.log(err);
      },
    );
  }

    // Show the loader for infinite time
    showLoader() {
      this.loadingController.create({
        message: 'Logging In Please Wait ...'
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

    async showAlert(message) {
      const alert = await this.alertCtrl.create({
        header: 'Status',
        message: message,
        buttons: [{
          text: 'OK'
        },]
      });
      await alert.present();
      await alert.onDidDismiss();
    }

    // getUserDetails() {
    //   this.hideLoader();
    //   this.service.lc_user(localStorage.getItem('username')).subscribe(
    //     (res: any) => {
    //       console.log(JSON.stringify(res));
    //         //localStorage.setItem('user_id', res[0].id);
            
    //         this.storage.set('user', JSON.stringify(res[0]));
    //         // localStorage.setItem('user', JSON.stringify(res[0]));
    //         //this.createUserKey();
    //     },
    //     (err: any) => {
    //       console.log(err);
    //     }
    //   );
    // }
  
}
