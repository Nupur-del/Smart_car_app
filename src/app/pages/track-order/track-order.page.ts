import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { LocalDbService, OrderStatus, OrderInfo, Order } from './../../services/local-db.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.page.html',
  styleUrls: ['./track-order.page.scss'],
})
export class TrackOrderPage implements OnInit {

  orderStatusForm: FormGroup;
  private userId: number;
  orderInfo: OrderInfo;
  ordStat: any = OrderStatus;
  orders: Array<Order>;
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController) { 
    console.log('api service = ', ApiService.user);
    this.orderStatusForm = this.formBuilder.group({
      order_id:['', Validators.required]
    });
    this.userId = ApiService.user.uid;
  }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders(){
    console.log('getting all orders = ', this.userId);
    this.api.getAllOrdersByUserId(this.userId)
    .subscribe(
      (resp:any) => {
        console.log('order selected = ',resp);
        this.orders = resp.data;
      },
      (err:any) => {
        console.log('err = ', err);
        this.api.showToast('Error in order selecting.' + err);
        this.api.hideLoader();
      }
    );
  }

  onOrderSubmit(){
    console.log('login form submit = ', this.orderStatusForm.value);
    if(this.orderStatusForm.invalid){
      // trigger form errors
      this.api.validateForm(this.orderStatusForm);
      return false;
    }
    const orderStatusData: any = this.orderStatusForm.value;
    // service to be called for saving login data in database
    this.api.showLoader();
    setTimeout(() => {
      this.orderInfo = this.localDB.getOrderStatus(orderStatusData.order_id, this.userId);
      console.log('order info = ', this.orderInfo);
      this.api.hideLoader();
    }, 1000);
  }

}
