import { GlobalApiService } from './../../../services/global-api.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder, FormControl, NgForm } from '@angular/forms';
import * as country_data from 'src/assets/countries.json';


export interface Country {
  value: string;
  display: string;
}



@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
})
export class AddUsersComponent implements OnInit {

  userCreateForm: FormGroup;
  passwordIcon: any;
  passType: any;
  data: any;
  param_userId: any;
  unameConflict: boolean;
  umailConflict: boolean;
  title: any;
  btnTitle: any;
  update_flag: boolean

  countries: Country[] = (country_data as any).default;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    private service: GlobalApiService,
    private loadingController: LoadingController) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.data = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;

        this.triggerProcess();
      }
    });

  }

  ngOnInit() { this.triggerProcess(); }


  triggerProcess() {
    this.passwordIcon = "eye-off";
    this.passType = "password";

    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.title = "update_user";
        this.btnTitle = "Update";
        this.update_flag = true;
        this.param_userId = params.id;
        this.fillEditFields(this.param_userId);
        this.setformValidators(this.update_flag);
      }
      else {
        this.title = "add_new_user";
        this.btnTitle = "Submit";
        this.update_flag = false;
        this.setformValidators(this.update_flag);
      }
    });
  }

  setformValidators(flag) {
    if (flag == false) {
      this.userCreateForm = this.formBuilder.group({
        username: new FormControl('', Validators.required,),
        new_pwd: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        first_name: new FormControl('', Validators.required),
        surname: new FormControl('', Validators.required),
        location: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      });
      this.userCreateForm.reset();
    }
    else if (flag == true) {
      this.userCreateForm = this.formBuilder.group({
        username: new FormControl(''),
        new_pwd: new FormControl(''),
        email: new FormControl(''),
        first_name: new FormControl('', Validators.required),
        surname: new FormControl('', Validators.required),
        location: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      });
    }
  }

  fillEditFields(userId: any) {
    let formData = new FormData();
    formData.append("user_id", userId);
    this.service.get_user(formData).subscribe((response) => {
      response.Data.forEach((element: any) => {
        this.userCreateForm.patchValue({
          username: element.username,
          new_pwd: 'Default@2468',
          first_name: element.firstname,
          surname: element.lastname,
          email: element.email,
          location: element.city,
          country: element.country
        });
      });
    },
      err => {

      });
  }

  RegistryCheck(target: any, fieldname: string) {
    if (this.update_flag == false) {
      let formData = new FormData();
      formData.append("field_value", target.value);
      formData.append("field_name", fieldname);
      formData.append("table_name", 'mdl_user');
      this.unameConflict = false;
      this.umailConflict = false;

      this.service.check_already_taken(formData).subscribe((response) => {

        this.cmValidateToggler(fieldname, null);
        if (response.Data.exists) {
          if (fieldname == 'username') {
            this.unameConflict = true;
          } else if (fieldname == 'email') {
            this.umailConflict = true;
          }
          this.cmValidateToggler(fieldname, { 'incorrect': true });
        }
      });
    }
  }


  cmValidateToggler(formcontrolname: string, state: any) {
    this.userCreateForm.controls[formcontrolname].setErrors(state);
  }

  hasError(controlName: string, validation: string) {
    return this.userCreateForm.get(controlName).hasError(validation);
  }


  hideShowPassword(type: number) {
    this.passwordIcon = (this.passwordIcon === 'eye') ? 'eye-off' : 'eye';
    this.passType = (this.passType === 'password') ? 'text' : 'password';
  }

  onSubmit() {
    let formData = new FormData();
    formData.append("username", this.userCreateForm.get('username').value);
    formData.append("new_pwd", this.userCreateForm.get('new_pwd').value);
    formData.append("email", this.userCreateForm.get('email').value);
    formData.append("first_name", this.userCreateForm.get('first_name').value);
    formData.append("surname", this.userCreateForm.get('surname').value);
    formData.append("location", this.userCreateForm.get('location').value);
    formData.append("country", this.userCreateForm.get('country').value);
    let msg: string;

    if (this.update_flag == true) {
      formData.append("user_id", this.param_userId);
      msg = "Updating User Please Wait...."
      this.showLoader(msg);
      this.service.update_user(formData).subscribe((response) => {
        if (response.Data) {
          this.hideLoader();
          msg = "User Updated Successfully";
          this.showAlert(msg);
        }
      },
        err => {
          this.hideLoader();
          console.log(err);
        });
    }
    else {
      msg = 'Creating User Please wait...';
      this.showLoader(msg);
      this.service.add_new_user(formData).subscribe((response) => {

        if (response.Data) {
          this.hideLoader();
          msg = "User Created Successfully";

          let formData = new FormData();
          formData.append("role",'Student');
          formData.append("username", this.userCreateForm.get('username').value);
          formData.append("new_pwd", this.userCreateForm.get('new_pwd').value);
          formData.append("email", this.userCreateForm.get('email').value);
          formData.append("first_name", this.userCreateForm.get('first_name').value);
          formData.append("surname", this.userCreateForm.get('surname').value);
          formData.append("location", this.userCreateForm.get('location').value);
          formData.append("phoneNumber", '1');
          formData.append("country", this.userCreateForm.get('country').value);
          this.hideLoader();
          this.showAlert(msg);
        }
      },
        err => {
          this.hideLoader();
          console.log(err);
        });
    }

  }

  // Show the loader for infinite time
  showLoader(msg: any) {
    this.loadingController.create({
      message: msg,
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


  async showAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      backdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('home/users');
        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }


}


