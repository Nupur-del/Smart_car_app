import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { LocalDbService } from './../../services/local-db.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editForm:FormGroup;
  userType:any;
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController) {
    console.log('user type = ', this.userType);
    this.editForm = this.formBuilder.group({
      name:['', Validators.required],
      gender:[1], // 1 - For female and 2 - Male
      address:['', Validators.required],
      userType:[this.userType], // from user type selected on welcome page
      uid:['']
    });
  }

  ngOnInit() {
    this.localDB.getUserInfo()
    .then((user)=>{
      console.log('get user  = ', user);
      this.editForm.controls['uid'].setValue(user.uid);
      // this.editForm.controls['uid'].updateValueAndValidity();
      this.editForm.controls['name'].setValue(user.name);
      this.editForm.controls['address'].setValue(user.address);
      this.editForm.controls['gender'].setValue((user.gender == "Male")?2:1);
    })
    .catch((err)=>{
      console.log('err = ',err);
    });
  }

  onEditSubmit(){
    console.log('login form submit = ', this.editForm.value);
    if(this.editForm.invalid){
      //trigger form errors
      this.api.validateForm(this.editForm);
      return false;
    }
    let editData:any = this.editForm.value;
    //service to be called for saving login data in database
    this.api.showLoader();
    this.api.editUser(editData)
    .subscribe(
      (resp:any) => {
        console.log('user saved = ', resp);
        this.navCtrl.navigateRoot('/dashboard');
        this.api.showToast('Profile updated successfully.');
        this.api.showToast(resp.message);
        this.api.hideLoader();
      },
      (err:any) => {
        console.log('err = ', err);
        this.api.showToast(err.message);
        this.api.hideLoader();
      }
    );
  }
}
