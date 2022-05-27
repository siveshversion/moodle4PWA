/* eslint-disable @typescript-eslint/naming-convention */
import { GlobalApiService } from 'src/app/services/global-api.service';
import { LoaderService } from 'src/app/services/loader.service';
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

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categorynameConflict: boolean;
  catId: any;
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
        this.catId = params.id;
        this.setformFields(this.catId);
      } else {
        this.setformFields('default');
      }
    });
  }

  setformFields(data: any) {
    if (data === 'default') {
      this.title = 'Category Creation';
      this.subtitle = 'add_new_category';
      this.btnName = 'save';
    } else {
      this.title = '';
      this.subtitle = 'update_category';
      this.btnName = 'save';
      this.setEditFields();
    }
  }

  setEditFields() {
    const msg = 'Loading Category form data...';
    this.loader.showAutoHideLoader(msg);
    // eslint-disable-next-line prefer-const
    let formData = new FormData();
    formData.append('cat_id', this.catId);

    this.service.get_category_by_id(formData).subscribe((response) => {
      if (response) {
        this.categoryForm.patchValue({
          categoryName: response.Data.name,
          categoryDescription: response.Data.description,
        });
      }
    });
  }

  setformValidators() {
    this.categoryForm = this.formBuilder.group({
      categoryName: new FormControl('', Validators.required),
      categoryDescription: new FormControl('', Validators.required),
    });
  }

  hasError(controlName: string, validation: string) {
    return this.categoryForm.get(controlName).hasError(validation);
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
            this.router.navigateByUrl('home/categories');
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  CategorynameRegistryCheck(value: string) {
    const formData = new FormData();
    const cat_id = this.catId > 0 ? this.catId : '';
    formData.append('field_value', value);
    formData.append('edit_id', cat_id);
    formData.append('field_name', 'name');
    formData.append('table_name', 'mdl_course_categories');

    this.service.check_already_taken(formData).subscribe((response) => {
      this.categorynameConflict = null;
      this.cmValidateToggler('categoryName', null);
      if (response.Data.exists) {
        this.categorynameConflict = true;
        this.cmValidateToggler('categoryName', { incorrect: true });
      }
    });
  }

  cmValidateToggler(formcontrolname: string, state: any) {
    this.categoryForm.controls[formcontrolname].setErrors(state);
  }

  submit() {
    const formData = new FormData();
    formData.append(
      'category_name',
      this.categoryForm.get('categoryName').value
    );
    formData.append(
      'category_description',
      this.categoryForm.get('categoryDescription').value
    );
    formData.append('creator_id', localStorage.getItem('user_id'));
    formData.append('cat_id', this.catId);

    if (this.catId) {
      this.update(formData);
    } else {
      this.save(formData);
    }
  }

  update(formData: any) {
    let msg: string;
    msg = 'Updating Category Please Wait....';
    this.loader.showAutoHideLoader(msg);
    this.service.update_category(formData).subscribe(
      (response) => {
        if (response) {
          msg = 'Category Updated Successfully';
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
    msg = 'Creating Category Please Wait....';
    this.loader.showAutoHideLoader(msg);
    this.service.create_category(formData).subscribe(
      (response) => {
        if (response) {
          msg = 'Category Created Successfully';
          this.showAlert(msg);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
