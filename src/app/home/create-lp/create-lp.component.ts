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
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-create-lp',
  templateUrl: './create-lp.component.html',
  styleUrls: ['./create-lp.component.scss'],
})
export class CreateLPComponent implements OnInit {
  lpForm: FormGroup;
  lpnameConflict: boolean;
  lpId: any;
  title: any;
  subtitle: any;
  btnName: any;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.setformValidators();

    this.route.queryParams.subscribe((params) => {
      if (params.id) {
        this.lpId = params.id;
        this.setformFields(this.lpId);
      } else {
        this.setformFields('default');
      }
    });
  }

  setformFields(data: any) {
    if (data === 'default') {
      this.title = 'LP Creation';
      this.subtitle = 'add_new_lp';
      this.btnName = 'save';
    } else {
      this.title = '';
      this.subtitle = 'update_lp';
      this.btnName = 'save';
      this.setEditFields();
    }
  }

  setEditFields() {
    const msg = 'Loading LP form data...';
    this.loader.showAutoHideLoader(msg);
    const formData = new FormData();
    formData.append('lp_id', this.lpId);

    this.service.get_lp_by_id(formData).subscribe((response) => {
      if (response) {
        this.lpForm.patchValue({
          lpName: response.Data.name,
          lpDescription: response.Data.description,
          lpDays: response.Data.lp_days,
          lpThreshold: response.Data.lp_threshold,
          lpCredit: response.Data.lp_credit,
        });
      }
    });
  }

  setformValidators() {
    this.lpForm = this.formBuilder.group({
      lpName: new FormControl('', Validators.required),
      lpDescription: new FormControl(''),
      lpCredit: new FormControl('', Validators.required),
      lpDays: new FormControl('', Validators.required),
      lpThreshold: new FormControl('', Validators.required),
    });
  }

  hasError(controlName: string, validation: string) {
    return this.lpForm.get(controlName).hasError(validation);
  }

  async showAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('home/lps');
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  LPnameRegistryCheck(target: any) {
    const formData = new FormData();
    const lp_id = this.lpId > 0 ? this.lpId : '';
    formData.append('field_value', target.value);
    formData.append('edit_id', lp_id);
    formData.append('field_name', 'lpname');
    formData.append('table_name', 'mdl_cm_admin_learning_path');

    this.service.check_already_taken(formData).subscribe((response) => {
      this.lpnameConflict = null;
      this.cmValidateToggler('lpName', null);
      if (response.Data.exists) {
        this.lpnameConflict = true;
        this.cmValidateToggler('lpName', { incorrect: true });
      }
    });
  }

  cmValidateToggler(formcontrolname: string, state: any) {
    this.lpForm.controls[formcontrolname].setErrors(state);
  }

  submit() {
    const formData = new FormData();
    formData.append('lp_name', this.lpForm.get('lpName').value);
    formData.append('lp_description', this.lpForm.get('lpDescription').value);
    formData.append('lp_creator_id', localStorage.getItem('user_id'));
    formData.append('lp_days', this.lpForm.get('lpDays').value);
    formData.append('lp_credit', this.lpForm.get('lpCredit').value);
    formData.append('lp_threshold', this.lpForm.get('lpThreshold').value);
    if (localStorage.getItem('buId')) {
      formData.append('buId', localStorage.getItem('buId'));
    }

    if (this.lpId) {
      this.update(formData);
    } else {
      this.save(formData);
    }
  }

  update(formData: any) {
    let msg: string;
    msg = 'Updating LP Please Wait....';
    this.loader.showAutoHideLoader(msg);
    formData.append('lp_id', this.lpId);
    this.service.update_lp(formData).subscribe(
      (response) => {
        if (response) {
          msg = 'LP Updated Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  save(formData: any) {
    let msg: string;
    msg = 'Creating LP Please Wait....';
    this.loader.showAutoHideLoader(msg);
    this.service.create_lp(formData).subscribe(
      (response) => {
        if (response.Data) {
          msg = 'LP Created Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  transform(event) {
    // Multiply by 1 to transform to number
    return event.value * 1;
  }
}
