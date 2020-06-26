import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { LocalDbService, Dealer, Service, Car } from './../../services/local-db.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
})
export class NewOrderPage implements OnInit {

  newOrderForm: FormGroup;
  dealers: Array<Dealer>;
  selectedDealer: any;
  services: Array<Service>;
  cars: Array<Car>;
  
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB: LocalDbService, private navCtrl: NavController) { 
    console.log('api service = ', ApiService.user);
    this.newOrderForm = this.formBuilder.group({
      dealer: ['', Validators.required],
      service: ['', Validators.compose([Validators.required])],
      amount: [''],
      car: ['', Validators.required],
      uid: [ApiService.user.uid]
    });
  }

  ngOnInit() {
    // get dealers and services they provide
    this.getDealers();
    this.getCars();
  }

  getDealers() {
    console.log('getting dealers information');
    this.api.showLoader();
    this.localDB.getAllDealers()
    .then((dealers: Array<Dealer>) => {
      this.dealers = dealers;
      console.log('got dealers = ', dealers);
      this.api.hideLoader();
    })
    .catch((err) => {
      console.log('get dealers err = ', err);
    });
  }

  getCars(){
    console.log('getting cars');
    console.log(ApiService.user.uid);
    this.api.getAllCarsByUserId(ApiService.user.uid)
    .subscribe(
      (resp:any) => {
        console.log('car selected = ',resp);
        this.cars = resp.data;
      },
      (err:any) => {
        console.log('err = ', err);
        this.api.showToast('Error in car selecting.' + err);
        this.api.hideLoader();
      }
    );
  }

  onDealerChange(ev) {
    console.log('selected dealer = ', ev);
    this.selectedDealer = this.dealers.find((dealer, i) => {
      return ((dealer.id === ev.detail.value));
    });
    this.services = this.selectedDealer.services;
  }

  onServiceChange(ev) {
    console.log('selected service = ', ev);
    const selectedService: any = this.services.find((service, i) => {
      return ((service.id === ev.detail.value));
    });
    this.newOrderForm.controls['amount'].setValue(selectedService.amount);
  }

  onNewOrderSubmit() {
    console.log('order form submit = ', this.newOrderForm.value);
    if (this.newOrderForm.invalid) {
      // trigger form errors
      this.api.validateForm(this.newOrderForm);
      return false;
    }
    const orderData: any = this.newOrderForm.value;
    // service to be called for saving login data in database
    this.api.showLoader();
    setTimeout(() => {
       this.api.addOrder(orderData)
       .subscribe(
        (resp:any) => {
          console.log('order saved = ',resp);
          this.api.showToast('Order added successfully.');
          this.api.hideLoader();
          this.navCtrl.navigateRoot('/dashboard')
          this.api.showToast(resp.message);
          this.api.hideLoader();
        },
        (err:any) => {
          console.log('err = ', err);
          this.api.showToast('Order did not get placed.' + err);
          this.api.hideLoader();
        }
      );
    }, 1000);
  }

}
