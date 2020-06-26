import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, Events } from '@ionic/angular';
import { ApiService } from './../../services/api.service';
import { LocalDbService } from './../../services/local-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  userType: any;
  userTypes: Array<any>;
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController, private events:Events) {
    
  }

  ngOnInit() {
    this.userType = ((this.localDB.getSelectedUserType() !== undefined) ? (this.localDB.getSelectedUserType().id || this.localDB.getSelectedUserType()) : 1);
    console.log('user type  = ', this.localDB.getSelectedUserType());
    console.log('user type  = ', this.userType);
    this.userTypes = this.localDB.userTypes;
    this.loginForm = this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required],
      userType:[this.userType]
    });
  }

  onLoginSubmit(){
    console.log('login form submit = ', this.loginForm.value);
    if(this.loginForm.invalid){
      // trigger form errors
      this.api.validateForm(this.loginForm);
      return false;
    }
    const loginData:any = this.loginForm.value;
    // service to be called for saving login data in database
    this.api.showLoader();
    setTimeout(()=>{
      let checkUser:any;
      switch(loginData.userType){
        case '1':
        case 1:
          // checkUser = this.localDB.checkForUser(loginData);
          checkUser = this.api.checkForUser(loginData);
        break;
        case '2':
        case 2:
          console.log('checking for dealer');
          checkUser = this.localDB.checkForDealer(loginData);
        break;
        case '3':
        case 3:
          checkUser = this.localDB.checkForDelivery(loginData);
        break;
      }
      checkUser.subscribe(
        (resp:any) => {
          console.log('check user = ', resp);
          console.log('login success');
          this.api.showToast('Login to User successfully');
          this.events.publish('app:login', resp.data);
          this.navCtrl.navigateRoot('/dashboard')
          .then((navigated:boolean)=>{
            if(navigated){
              this.api.showToast('Logged in successfully.');
            }
          })
          .catch((err)=>{
            console.log('err = ', err);
          });
          this.api.showToast(resp.message);
          this.api.hideLoader();
        },
        (err:any) => {
          console.log('err = ', err);
          this.api.hideLoader();
        }
      );
      //if(!checkUser){
        // Show message for invalid user or password
       // console.log('login err');
        //this.api.showToast('Invalid username or password.');
     // }
      //else{
        //redirect to dashboard section
  
        //console.log('login success');
        //this.events.publish('app:login', checkUser);
        //this.navCtrl.navigateRoot('/dashboard')
        //.then((navigated:boolean)=>{
         // if(navigated){
          //  this.api.showToast('Logged in successfully.');
         // }
        //})
        //.catch((err)=>{
         // console.log('err = ', err);
       // });
      //}
      //this.api.hideLoader();
    }, 1500);
  }
}
