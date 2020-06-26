import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { LocalDbService } from './../../services/local-db.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm:FormGroup;
  userType:any;
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController) { 
    this.userType = ((this.localDB.getSelectedUserType() !== undefined) ? (this.localDB.getSelectedUserType().id || this.localDB.getSelectedUserType()) : 1);
    console.log('user type = ', this.userType);
    switch(this.userType) {
      case '1':
      case 1:
        this.registerForm = this.formBuilder.group({
          name:['', Validators.required],
          email:['', Validators.compose([Validators.required, Validators.email])],
          mobile:['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{10}$/)])],
          gender:[1], // 1 - For female and 2 - Male
          address:['', Validators.required],
          password:['', Validators.required],
          confirm_password:['', Validators.required],
          userType:[this.userType] // from user type selected on welcome page
        }, { 'validator': this.passwordMatched });
      break;
      case '2':
      case 2:
        this.registerForm = this.formBuilder.group({
          company_name:['', Validators.required],
          email:['', Validators.compose([Validators.required, Validators.email])],
          contact_no:['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{10}$/)])],
          pincode:['', Validators.required], // 1 - For female and 2 - Male
          address:['', Validators.required],
          city:['', Validators.required],
          password:['', Validators.required],
          confirm_password:['', Validators.required],
          opening_time:['', Validators.required],
          closing_time:['', Validators.required],
          userType:[this.userType] // from user type selected on welcome page
        }, { 'validator': this.passwordMatched });
      break;
      case '3':
      case 3:
        this.registerForm = this.formBuilder.group({
          name:['', Validators.required],
          email:['', Validators.compose([Validators.required, Validators.email])],
          contact_no:['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{10}$/)])],
          gender:[1], // 1 - For female and 2 - Male
          address:['', Validators.required],
          password:['', Validators.required],
          confirm_password:['', Validators.required],
          userType:[this.userType] // from user type selected on welcome page
        }, { 'validator': this.passwordMatched });
      break;
    }
    console.log('test = ', this.registerForm);
  }

  ngOnInit() {
  }

  onRegisterSubmit(){
    console.log('login form submit = ', this.registerForm.value);
    if(this.registerForm.invalid){
      //trigger form errors
      this.api.validateForm(this.registerForm);
      return false;
    }
    let registerData:any = this.registerForm.value;
    //service to be called for saving login data in database
    this.api.showLoader();
    switch(this.userType){
      case '1':
      case 1:
        this.api.addUser(registerData)
        .subscribe(
          (resp:any) => {
            console.log('user saved = ', resp);
            this.navCtrl.navigateRoot('/login');
            this.api.showToast('User registered successfully.');
            this.api.showToast(resp.message);
            this.api.hideLoader();
          },
          (err:any) => {
            console.log('err = ', err);
            this.api.showToast('User is already exists');
            this.api.hideLoader();
          }
        );
      break;
      case '2':
      case 2:
        this.localDB.addDealer(registerData)
        .then((resp)=>{
          this.api.hideLoader();
          console.log('user saved = ',resp);
          this.api.showToast('Dealer registered successfully.');
          this.navCtrl.navigateRoot('/login');
        })
        .catch((err)=>{
          console.log('err = ',err);
          this.api.showToast('Error in user registration.' + err);
        });
      break;
      case '3':
      case 3:
        this.localDB.addDelivery(registerData)
        .then((resp)=>{
          this.api.hideLoader();
          console.log('user saved = ',resp);
          this.api.showToast('Delivery person registered successfully.');
          this.navCtrl.navigateRoot('/login');
        })
        .catch((err)=>{
          console.log('err = ',err);
          this.api.showToast('Error in user registration.' + err);
        });
      break;
    }
  }

  passwordMatched = (control: AbstractControl):any =>    
  {
    // console.log('control = ', control);
    let pass:string = control.get('password').value;
    let confirmPass:string = control.get('confirm_password').value;
    if(pass.toLowerCase() != confirmPass.toLowerCase()){
      control.get('confirm_password').setErrors({'passwords_mismatched' : true});
    }
    else{
      // control.get('conf_new_password').setErrors(null);
    }
  }

}
