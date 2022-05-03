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
import { environment } from 'src/environments/environment';

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
  selectedFile: any;
  encodedFile: any;
  okFlag: boolean;
  logoexists: boolean;
  update_flag: boolean;
  Logo_path: string;
  allowedExtensions = ['JPEG', 'PNG', 'JPG', 'jpeg', 'png', 'jpg'];
  fileName = 'Choose Logo';

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
      this.buForm.reset();
      if (params.id) {
        this.buId = params.id;
        this.setformFields(this.buId);
      } else {
        this.setformFields('default');
      }
    });
  }

  setformFields(data: any) {
    if (data === 'default') {
      this.title = 'BU Creation';
      this.subtitle = 'add_new_bu';
      this.btnName = 'save';
    } else {
      this.title = '';
      this.subtitle = 'update_bu';
      this.update_flag = true;
      this.btnName = 'save';
      this.setEditFields();
    }
  }

  setEditFields() {
    this.showLoader('Loading BU form data...');
    const formData = new FormData();
    formData.append('bu_id', this.buId);

    this.service.get_bu_by_id(formData).subscribe((response) => {
      if (response) {
        this.fileName = (response.Data.logo_name) ? response.Data.logo_name : 'Choose File';
        this.logoexists = (response.Data.logo_path) ? true : false;
        this.Logo_path = response.Data.logo_path;
        this.buForm.patchValue({
          buName: response.Data.buname,
        });
      }
      this.hideLoader();
    });
  }


  getUploadedLogo() {
    const file_src = environment.moodle_url + this.Logo_path;
    const redirectUrl = environment.moodle_url + "/cm/api/download.php?src=" + file_src + "&filename=" + this.fileName;
    window.open(redirectUrl, "_self");
  }

  setformValidators() {
    this.buForm = this.formBuilder.group({
      buName: new FormControl('', Validators.required),
      file: new FormControl('')
    });
  }

  hasError(controlName: string, validation: string) {
    return this.buForm.get(controlName).hasError(validation);
  }


  async showCustomAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
    await alert.onDidDismiss();
  }


  chooseFile(filename: any, event: any) {
    this.okFlag = this.isValid_extension(event);
    if (this.okFlag) {
      this.fileName = filename;
      this.selectedFile = event;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.encodedFile = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
    else {
      this.fileName = 'Choose Logo *';
    }
  }


  isValid_extension(file: File) {
    const allowedExtensions = this.allowedExtensions;

    if (file instanceof File) {
      const ext = this.getExtension(file.name);
      if (allowedExtensions.indexOf(ext) === -1) {
        const title = 'File type not allowed';
        const msg = 'Upload valid image type';
        this.showCustomAlert(title, msg);
        this.okFlag = null;
      }
      else {
        this.okFlag = true;
      }
    }
    return this.okFlag;
  }


  getExtension(filename: string): null | string {
    if (filename.indexOf('.') === -1) {
      return null;
    }
    return filename.split('.').pop();
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

  async showAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('home/bus');
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  buNameRegistryCheck(target: any) {
    const formData = new FormData();
    const bu_id = this.buId > 0 ? this.buId : '';
    formData.append('field_value', target.value);
    formData.append('edit_id', bu_id);
    formData.append('field_name', 'bu_name');
    formData.append('table_name', 'mdl_cm_business_units');

    this.service.check_already_taken(formData).subscribe((response) => {
      this.buNameConflict = null;
      this.cmValidateToggler('buName', null);
      if (response.Data.exists) {
        this.buNameConflict = true;
        this.cmValidateToggler('buName', { incorrect: true });
      }
    });
  }

  cmValidateToggler(formcontrolname: string, state: any) {
    this.buForm.controls[formcontrolname].setErrors(state);
  }

  submit() {
    const formData = new FormData();
    formData.append('bu_name', this.buForm.get('buName').value);
    formData.append("logoFile", this.encodedFile);
    formData.append("logoFileName", this.fileName);

    if (this.buId) {
      this.update(formData);
    } else {
      this.save(formData);
    }
  }

  update(formData: any) {
    let msg: string;
    msg = 'Updating BU Please Wait....';
    this.showLoader(msg);
    formData.append('bu_id', this.buId);
    formData.append("logoFile", this.encodedFile);
    formData.append("logoFileName", this.fileName);

    this.service.update_bu(formData).subscribe(
      (response) => {
        if (response) {
          this.hideLoader();
          msg = 'BU Updated Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        this.hideLoader();
        console.log(err);
      }
    );
  }

  save(formData: any) {
    let msg: string;
    msg = 'Creating BU Please Wait....';
    this.showLoader(msg);
    this.service.create_bu(formData).subscribe(
      (response) => {
        if (response.Data) {
          this.hideLoader();
          msg = 'BU Created Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        this.hideLoader();
        console.log(err);
      }
    );
  }

  transform(event) {
    // Multiply by 1 to transform to number
    return event.value * 1;
  }
}
