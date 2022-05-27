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
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent implements OnInit {
  courseId: any;
  title: any;
  subtitle: any;
  btnName: any;
  courseForm: FormGroup;
  categories = [];
  shortnameConflict: boolean;
  old_enroll_id: any;
  cat_id: any;
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
    public loadingController: LoadingController
  ) {
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
      topicCnt: new FormControl('', Validators.required),
      enrollmentType: new FormControl('', Validators.required),
      courseType: new FormControl('', Validators.required),
      durationHrs: new FormControl('', null),
      durationMins: new FormControl('', null),
      points: new FormControl('', null),
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
    formData.append('enroll_type', this.courseForm.get('enrollmentType').value);
    formData.append('topicCnt', this.courseForm.get('topicCnt').value);
    formData.append('creator_id', localStorage.getItem('user_id'));
    formData.append('durationHrs', this.courseForm.get('durationHrs').value);
    formData.append('durationMins', this.courseForm.get('durationMins').value);
    formData.append('points', this.courseForm.get('points').value);
    formData.append('courseType', this.courseForm.get('courseType').value);

    if (this.courseId) {
      this.update(formData);
    } else {
      this.save(formData);
    }
  }

  save(formData) {
    let msg: string;
    msg = 'Creating Course Please Wait....';
    this.loader.showAutoHideLoader(msg);
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

    this.service.check_already_taken(formData).subscribe((response) => {
      this.shortnameConflict = null;
      this.cmValidateToggler('courseShortName', null);
      if (response.Data.exists) {
        this.shortnameConflict = true;
        this.cmValidateToggler('courseShortName', { incorrect: true });
      }
    });
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
}
