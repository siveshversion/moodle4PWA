/* eslint-disable @typescript-eslint/naming-convention */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bulk-user-registration',
  templateUrl: './bulk-user-registration.component.html',
  styleUrls: ['./bulk-user-registration.component.scss'],
})
export class BulkUserRegistrationComponent implements OnInit {
  bulkUserForm: FormGroup;
  selectedFile: any;
  uploadResponse: any;
  class_str: any;
  redirectUrl: any;
  encodedFile: any;
  allowedExtensions = ['csv', 'xls', 'xlsx'];
  fileName: string;
  okFlag: boolean;

  constructor(
    private service: GlobalApiService,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private loader: LoaderService,
    private router: ActivatedRoute,
  ) {
    this.router.queryParams.subscribe((params) => {
      this.fileName = 'Choose File';
      this.setformValidators();
    });
  }

  ngOnInit() {}

  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  chooseFile(target: any) {
    const filename = target.files[0].name;
    const event = target.files[0];
    this.okFlag = this.isValid_extension(event);
    if (this.okFlag) {
      this.fileName = filename;
      this.selectedFile = event;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.encodedFile = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.fileName = 'Choose File';
    }
  }

  hasError(controlName: string, validation: string) {
    return this.bulkUserForm.get(controlName).hasError(validation);
  }

  setformValidators() {
    this.bulkUserForm = this.formBuilder.group({
      file: new FormControl('', Validators.required),
    });
  }

  isValid_extension(file: File) {
    const allowedExtensions = this.allowedExtensions;

    if (file instanceof File) {
      const ext = this.getExtension(file.name);
      if (allowedExtensions.indexOf(ext) === -1) {
        const title = 'File type not allowed';
        const msg = 'Upload Csv or xls';
        this.showAlert(title, msg);
        this.okFlag = null;
      } else {
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

  async submit() {
    this.loader.showLoader('Uploading Users Please wait...');

    const formData = new FormData();

    let uploadingfileName = this.selectedFile.name;
    uploadingfileName = uploadingfileName.replace(/\s+/g, '_');
    formData.append('file_input', this.encodedFile);
    formData.append('file_name', uploadingfileName);
    formData.append('user_id', localStorage.getItem('user_id'));

    let status: any;
    this.service.add_bulk_users(formData).subscribe(
      (res) => {
        console.log('user response'+ JSON.stringify(res.Data));
        res.Data.forEach((element: any) => {
          if (element.error) {
            this.class_str = 'contains-error';
            this.uploadResponse = element.error;
          } else if (element.status === 'ok') {
            status = 'ok';
          }
        });
        this.loader.hideLoader();
        if (status === 'ok') {
          const title = 'Status';
          const msg = 'Users uploaded successfully';
          this.showAlert(title, msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getSampleCSV() {
    const file_src = environment.moodle_url + '/cm/api/uploads/sample.csv';
    this.redirectUrl =
      environment.moodle_url + '/cm/api/download.php?src=' + file_src;
    window.open(file_src, '_self');
  }
}
