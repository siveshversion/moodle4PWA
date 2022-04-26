/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { GlobalApiService } from 'src/app/services/global-api.service';


@Component({
  selector: 'app-create-bu',
  templateUrl: './create-bu.component.html',
  styleUrls: ['./create-bu.component.scss'],
})
export class CreateBUComponent implements OnInit {

  buForm: FormGroup;
  buNameConflict: boolean;
  buId: any;
  title: any;
  subtitle: any;
  btnName: any;

  constructor(
    private service: GlobalApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingController: LoadingController) { }

  ngOnInit() {

    this.setformValidators();

    this.route.queryParams.subscribe(
      params => {
        this.buForm.reset();
        if (params.id) {
          this.buId = params.id;
          this.setformFields(this.buId);
        }
        else {
          this.setformFields('default');
        }
      }
    );
  }


  setformFields(data: any) {
    if (data === 'default') {
      this.title = 'BU Creation';
      this.subtitle = 'add_new_bu';
      this.btnName = 'save';
    }
    else {
      this.title = '';
      this.subtitle = 'update_bu';
      this.btnName = 'save';
      this.setEditFields();

    }
  }

  setEditFields() {
    this.showLoader('Loading BU form data...');
    const formData = new FormData();
    formData.append("bu_id", this.buId);

    this.service.get_bu_by_id(formData).subscribe((response) => {
      if (response) {
        this.buForm.patchValue({
          buName: response.Data.buname
        });
      }
      this.hideLoader();
    });
  }


  setformValidators() {
    this.buForm = this.formBuilder.group({
      buName: new FormControl('', Validators.required)
    });

  }


  hasError(controlName: string, validation: string) {
    return this.buForm.get(controlName).hasError(validation);
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
          this.router.navigateByUrl('home/bus');
        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }


  buNameRegistryCheck(target: any) {
    const formData = new FormData();
    const bu_id = (this.buId > 0) ? this.buId : '';
    formData.append("field_value", target.value);
    formData.append("edit_id", bu_id);
    formData.append("field_name", 'bu_name');
    formData.append("table_name", 'mdl_cm_business_units');

    this.service.check_already_taken(formData).subscribe((response) => {
      this.buNameConflict = null;
      this.cmValidateToggler('buName', null);
      if (response.Data.exists) {
        this.buNameConflict = true;
        this.cmValidateToggler('buName', { 'incorrect': true });
      }
    });

  }

  cmValidateToggler(formcontrolname: string, state: any) {
    this.buForm.controls[formcontrolname].setErrors(state);
  }



  submit() {
    const formData = new FormData();
    formData.append("bu_name", this.buForm.get('buName').value);

    if (this.buId) {
      this.update(formData);
    }
    else {
      this.save(formData);
    }


  }

  update(formData: any) {
    let msg: string;
    msg = "Updating BU Please Wait....";
    this.showLoader(msg);
    formData.append("bu_id", this.buId);
    this.service.update_bu(formData).subscribe((response) => {
      if (response) {
        this.hideLoader();
        msg = "BU Updated Successfully";
        this.showAlert(msg);
      }
    },
      err => {
        this.hideLoader();
        console.log(err);
      });
  }

  save(formData: any) {
    let msg: string;
    msg = "Creating BU Please Wait....";
    this.showLoader(msg);
    this.service.create_bu(formData).subscribe((response) => {
      if (response.Data) {
        this.hideLoader();
        msg = "BU Created Successfully";
        this.showAlert(msg);
      }
    },
      err => {
        this.hideLoader();
        console.log(err);
      });
  }


  transform(event) {
    // Multiply by 1 to transform to number
    return event.value * 1;
  }

}
