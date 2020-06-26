import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { LocalDbService } from './../../services/local-db.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {

  addCarForm:FormGroup;
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController) { 
    console.log('api service = ', ApiService.user);
    this.addCarForm = this.formBuilder.group({
      model:['', Validators.required],
      registration_number:['', Validators.compose([Validators.required])],
      uid:[ApiService.user.uid]
    });
  }

  ngOnInit() {
  }

  onAddCarSubmit(){
    console.log('login form submit = ', this.addCarForm.value);
    if(this.addCarForm.invalid){
      //trigger form errors
      this.api.validateForm(this.addCarForm);
      return false;
    }
    let carData:any = this.addCarForm.value;
    //service to be called for saving login data in database
    this.api.showLoader();
    this.api.addCar(carData)
    .subscribe(
      (resp:any) => {
        console.log('car saved = ',resp);
        this.api.showToast('Car added successfully.');
        this.api.hideLoader();
        this.navCtrl.navigateRoot('/dashboard')
        this.api.showToast(resp.message);
        this.api.hideLoader();
      },
      (err:any) => {
        console.log('err = ', err);
        this.api.showToast('Car with this registration number is already exist');
        this.api.hideLoader();
      }
    );
  }

}
