import { GlobalApiService } from './../../../services/global-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  myGroup: FormGroup;
  categories = [];
  shortnameConflict: Boolean;
  old_enroll_id: any;
  cat_id: any;
  enrollType = [
    { value: 'self', viewValue: 'Free' },
    { value: 'manual', viewValue: 'Admin' }
  ];

  public addresses: any[] = [{
    id: 1,
    address: '',
    street: '',
    city: '',
    country: ''
  }];
  days_valid: any;

  constructor(
    private service: GlobalApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingController: LoadingController) { }

  ngOnInit() {

    this.setformValidators();

    this.getCategories();

    this.route.queryParams.subscribe(
      params => {
        if (params.cid && params.cat) {
          this.courseId = params.cid;
          this.cat_id = Number(params.cat);
          this.setformFields('update');
        }
        else {
          this.courseForm.reset();
          this.setformFields('default');
        }


      }
    );

  }

  setformFields(data: any) {
    if (data === 'default') {
      this.title = 'Course Creation';
      this.subtitle = 'add_new_course';
      this.btnName = 'save';
    }
    else if (data === 'update') {
      this.title = '';
      this.subtitle = 'update_course';
      this.btnName = 'update';
      this.setEditFields();
    }
  }

  setEditFields() {
    //this.showLoader('Loading Course form data...');
    let formData = new FormData();
    formData.append("course_id", this.courseId);
    
    this.service.get_course_by_id(formData).subscribe((response) => {
      if (response.Data) {
        let enrolled_type = response.Data.enrol_method;
        this.old_enroll_id = response.old_enroll_id;

        this.setCategoryField(this.cat_id);

        this.courseForm.patchValue({
          courseFullName: response.Data.fullname,
          courseShortName: response.Data.shortname,
          courseDescription: response.Data.description,
          topicCnt: response.Data.topics_cnt,
          enrollmentType: enrolled_type,
        });

        this.hideLoader();
      }
    });
  }





  setformValidators() {

    this.courseForm = this.formBuilder.group({
      courseCategory: new FormControl('', Validators.required),
      courseFullName: new FormControl('', Validators.required),
      courseShortName: new FormControl('', Validators.required),
      courseDescription: new FormControl('', Validators.required),
      topicCnt: new FormControl('', Validators.required),
      enrollmentType: new FormControl('', Validators.required)
    });

  }


  hasError(controlName: string, validation: string) {
    return this.courseForm.get(controlName).hasError(validation);
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

          this.router.navigateByUrl('home/courses');


        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }


  async showWarning(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Status',
      message: msg,
      backdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {




        }
      },]
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  getCategories() {
    let formData = new FormData();
    formData.append("userId", localStorage.getItem('user_id'));

    this.service.category_list(formData).subscribe(
      res => {
        res.Data.forEach((element: any) => {
          var cat_data = {
            value: element.category_id,
            viewValue: element.category_name
          };
          this.categories.push(cat_data);
        });
      }, err => {
        console.log(err);
      });
  }


  submit() {

    let formData = new FormData();
    formData.append("course_category", this.courseForm.get('courseCategory').value);
    formData.append("course_full_name", this.courseForm.get('courseFullName').value);
    formData.append("course_short_name", this.courseForm.get('courseShortName').value);
    formData.append("course_description", this.courseForm.get('courseDescription').value);
    formData.append("enroll_type", this.courseForm.get('enrollmentType').value);
    formData.append("topicCnt", this.courseForm.get('topicCnt').value);
    formData.append('creator_id', localStorage.getItem('user_id'));



    if (this.courseId) {

      this.update(formData);
    }
    else {
      this.save(formData);
    }

  }


  save(formData) {
    let msg: string;

    msg = "Creating Course Please Wait...."
    this.showLoader(msg);
    this.service.create_course(formData).subscribe((response) => {
      if (response.Data.id) {
        this.hideLoader();
        msg = "Course Created Successfully";
        this.showAlert(msg);
      }
    },
      err => {
        this.hideLoader();
        console.log(err);
      });
  }

  update(formData) {

    formData.append('course_id', this.courseId);
    formData.append('old_enroll_id', this.old_enroll_id);

    let msg: string;

    msg = "Updating Course Please Wait...."
    this.showLoader(msg);
    this.service.update_course(formData).subscribe((response) => {
      if (response) {
        this.hideLoader();
        msg = "Course Updated Successfully";
        this.showAlert(msg);
      }
    },
      err => {
        this.hideLoader();
        console.log(err);
      });
  }
  RegistryCheck(target: any) {
    let courseId = (this.courseId > 0) ? this.courseId : '';
    let formData = new FormData();
    formData.append("field_value", target.value);
    formData.append("field_name", 'shortname');
    formData.append("table_name", 'mdl_course');
    formData.append("edit_id", courseId);

    this.service.check_already_taken(formData).subscribe((response) => {
      this.shortnameConflict = null;
      this.cmValidateToggler('courseShortName', null);
      if (response.Data.exists) {
        this.shortnameConflict = true;
        this.cmValidateToggler('courseShortName', { 'incorrect': true });
      }
    });
  }


  cmValidateToggler(formcontrolname: string, state: any) {
    this.courseForm.controls[formcontrolname].setErrors(state);
  }


  setCategoryField(catid: any) {
    let index = this.categories.findIndex(p => p.value == catid);
    this.courseForm.controls['courseCategory'].setValue(this.categories[index].value);
  }


}
