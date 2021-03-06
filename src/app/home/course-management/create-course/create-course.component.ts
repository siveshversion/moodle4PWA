import { PopupLoadCourseImagesPage } from './../../modals/popup-load-course-images/popup-load-course-images.page';
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent implements OnInit {
  CImagefromDefaults = '';
  courseId: any;
  title: any;
  subtitle: any;
  btnName: any;
  courseForm: FormGroup;
  categories = [];
  shortnameConflict: boolean;
  old_enroll_id: any;
  cat_id: any;
  role: any;
  allowedExtensions = ['JPEG', 'PNG', 'JPG', 'jpeg', 'png', 'jpg'];
  fileName = 'Choose Image';
  selectedFile: any;
  encodedFile: any;
  okFlag: boolean;
  update_flag: boolean;
  logoexists: boolean;
  Logo_path: string;
  enrollType = [
    { value: 'self', viewValue: 'Free' },
    { value: 'manual', viewValue: 'Admin' },
  ];
  courseType = [
    { value: 0, viewValue: 'Online' },
    { value: 1, viewValue: 'Classroom' },
  ];

  hoursValue = [];
  minsValue = [];

  public addresses: any[] = [
    {
      id: 1,
      address: '',
      street: '',
      city: '',
      country: '',
    },
  ];
  days_valid: any;

  constructor(
    private service: GlobalApiService,
    private loader: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private modalController: ModalController
  ) {
    this.role = localStorage.getItem('role');
    this.setformValidators();
    this.route.queryParams.subscribe((params) => {
      if (params.cid && params.cat) {
        this.courseId = params.cid;
        this.cat_id = Number(params.cat);
        this.getCategories();
        this.setformFields('update');
      } else if (params.cat) {
        this.cat_id = Number(params.cat);
        this.setformFields('setCategory');
      } else {
        this.courseForm.reset();
        this.getCategories();
        this.setformFields('default');
      }
    });
  }

  ngOnInit() {
    for (let i = 0; i < 25; i++) {
      const val = { value: i, viewValue: i };
      this.hoursValue.push(val);
    }

    for (let i = 0; i < 61; i++) {
      const val = { value: i, viewValue: i };
      this.minsValue.push(val);
    }
  }

  setformFields(data: any) {
    if (data === 'default') {
      this.title = 'Course Creation';
      this.subtitle = 'add_new_course';
      this.btnName = 'save';
    } else if (data === 'update') {
      this.title = '';
      this.subtitle = 'update_course';
      this.btnName = 'update';
      this.setEditFields();
    } else if (data === 'setCategory') {
      this.title = 'Course Creation';
      this.subtitle = 'add_new_course';
      this.btnName = 'save';
      this.setCatField();
    }
  }

  setEditFields() {
    this.loader.showAutoHideLoader('Loading Course Data...');
    const formData = new FormData();
    formData.append('course_id', this.courseId);

    this.service.get_course_by_id(formData).subscribe((response) => {
      if (response.Data) {
        const enrolled_type = response.Data.enrol_method;
        this.old_enroll_id = response.old_enroll_id;

        this.setCategoryField(this.cat_id);

        this.courseForm.patchValue({
          courseFullName: response.Data.fullname,
          courseShortName: response.Data.shortname,
          courseDescription: response.Data.description,
          topicCnt: response.Data.topics_cnt,
          enrollmentType: enrolled_type,
          points: response.Data.points,
          courseType: response.Data.course_type,
          durationHrs: response.Data.duration_hrs,
          durationMins: response.Data.duration_mins,
        });

        if (response.Data.course_img.length > 0) {
          this.fileName = response.Data.course_img;
        }
      }
    });
  }

  setCatField() {
    const msg = 'Allotting Category';
    this.loader.showAutoHideLoader(msg);
    const formData = new FormData();
    formData.append('userId', localStorage.getItem('user_id'));

    this.categories = [];

    this.service.category_list(formData).subscribe(
      (res) => {
        res.Data.forEach((elem: any) => {
          const cat_data = {
            value: elem.category_id,
            viewValue: elem.category_name,
          };
          this.categories.push(cat_data);
        });
        this.setCategoryField(this.cat_id);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setformValidators() {
    this.courseForm = this.formBuilder.group({
      courseCategory: new FormControl('', Validators.required),
      courseFullName: new FormControl('', Validators.required),
      courseShortName: new FormControl('', Validators.required),
      courseDescription: new FormControl('', Validators.required),
      courseType: new FormControl('', Validators.required),
      topicCnt: new FormControl('', Validators.required),
      enrollmentType: new FormControl('', Validators.required),
      courseImage: new FormControl('', null),
      durationHrs: new FormControl('', null),
      durationMins: new FormControl('', null),
      points: new FormControl('', null),
      // enrollBuUsersChk: new FormControl('', null),
    });
  }

  hasError(controlName: string, validation: string) {
    return this.courseForm.get(controlName).hasError(validation);
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
            this.router.navigateByUrl('home/courses');
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  async showWarning(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {},
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  getCategories() {
    const formData = new FormData();
    formData.append('userId', localStorage.getItem('user_id'));

    this.service.category_list(formData).subscribe(
      (res) => {
        res.Data.forEach((elem: any) => {
          const cat_data = {
            value: elem.category_id,
            viewValue: elem.category_name,
          };
          this.categories.push(cat_data);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  submit() {
    if (this.courseForm.get('courseShortName').value.length > 0) {
      const formData = new FormData();
      formData.append(
        'course_category',
        this.courseForm.get('courseCategory').value
      );
      formData.append(
        'course_full_name',
        this.courseForm.get('courseFullName').value
      );
      formData.append(
        'course_short_name',
        this.courseForm.get('courseShortName').value
      );
      formData.append(
        'course_description',
        this.courseForm.get('courseDescription').value
      );
      formData.append(
        'enroll_type',
        this.courseForm.get('enrollmentType').value
      );
      formData.append('topicCnt', this.courseForm.get('topicCnt').value);
      formData.append('creator_id', localStorage.getItem('user_id'));
      formData.append('durationHrs', this.courseForm.get('durationHrs').value);
      formData.append(
        'durationMins',
        this.courseForm.get('durationMins').value
      );
      formData.append('points', this.courseForm.get('points').value);
      formData.append('courseType', this.courseForm.get('courseType').value);
      if (
        typeof this.encodedFile !== 'undefined' ||
        (this.encodedFile !== '' && this.fileName !== 'Choose Image')
      ) {
        formData.append('logoFile', this.encodedFile);
        formData.append('logoFileName', this.fileName);
      } else if (
        this.CImagefromDefaults !== '' &&
        this.fileName !== 'Choose Image'
      ) {
        formData.append('logoFileName', this.CImagefromDefaults);
      }

      if (this.courseId) {
        this.update(formData);
      } else {
        this.save(formData);
      }
    } else {
      alert('Course Short Name - should not be empty');
      this.cmValidateToggler('courseShortName', { incorrect: true });
    }
  }

  save(formData) {
    let msg = 'Creating Course Please Wait....';
    this.loader.showAutoHideLoader(msg);
    // formData.append(
    //   'enrollBuUsersChk',
    //   this.courseForm.get('enrollBuUsersChk').value
    // );
    if (localStorage.getItem('buId')) {
      formData.append('bu_id', localStorage.getItem('buId'));
      formData.append('userId', localStorage.getItem('user_id'));
    }
    this.service.create_course(formData).subscribe(
      (response) => {
        if (response.Data.id) {
          console.log(JSON.stringify(response.Data));
          msg = 'Course Created Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  update(formData) {
    formData.append('course_id', this.courseId);
    formData.append('old_enroll_id', this.old_enroll_id);
    let msg: string;
    msg = 'Updating Course Please Wait....';
    this.loader.showAutoHideLoader(msg);
    this.service.update_course(formData).subscribe(
      (response) => {
        if (response) {
          msg = 'Course Updated Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  RegistryCheck(target: any) {
    const courseId = this.courseId > 0 ? this.courseId : '';
    const formData = new FormData();
    formData.append('field_value', target.value);
    formData.append('field_name', 'shortname');
    formData.append('table_name', 'mdl_course');
    formData.append('edit_id', courseId);

    if (target.value.length > 0) {
      this.service.check_already_taken(formData).subscribe((response) => {
        this.shortnameConflict = null;
        this.cmValidateToggler('courseShortName', null);
        if (response.Data.exists) {
          this.shortnameConflict = true;
          this.cmValidateToggler('courseShortName', { incorrect: true });
        } else {
          this.shortnameConflict = null;
          this.cmValidateToggler('courseShortName', null);
        }
      });
    }
  }

  cmValidateToggler(formcontrolname: string, state: any) {
    this.courseForm.controls[formcontrolname].setErrors(state);
  }

  setCategoryField(catid: any) {
    const index = this.categories.findIndex((p) => p.value == catid);
    this.courseForm.controls.courseCategory.setValue(
      this.categories[index].value
    );
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
      this.fileName = 'Choose Image';
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

  getUploadedLogo() {
    const file_src = environment.moodle_url + this.Logo_path;
    const redirectUrl =
      environment.moodle_url +
      '/cm/api/download.php?src=' +
      file_src +
      '&filename=' +
      this.fileName;
    window.open(redirectUrl, '_self');
  }

  async showCustomAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  async openImagePopupModal() {
    const modal = await this.modalController.create({
      component: PopupLoadCourseImagesPage,
      componentProps: { filename: '' },
      backdropDismiss: false,
      cssClass: 'my-custom-class',
    });

    modal.onDidDismiss().then((res) => {
      if (typeof res.data !== 'undefined') {
        this.CImagefromDefaults = res.data;
        this.fileName = this.CImagefromDefaults;
        this.encodedFile = '';
      } else {
        this.CImagefromDefaults = '';
        this.fileName = 'Chooose Image';
      }
    });

    return await modal.present();
  }
}
