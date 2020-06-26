import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { LocalDbService, OrderStatus, OrderInfo, ORDER_STATUS } from './../../services/local-db.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  feedbackForm: FormGroup;
  private userId: number;
  ratingStarts: Array<any>;
  selectedRate: any;
  orders: any;
  constructor(private formBuilder: FormBuilder, private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController) { 
    console.log('api service = ', ApiService.user);
    this.userId = ApiService.user.id;
    this.ratingStarts = [
      {
        id: 1,
        value: 1,
        text: 'Bad',
        icon: 'star-outline'
      },
      {
        id: 2,
        value: 2,
        text: 'Satisfactory',
        icon: 'star-outline'
      },
      {
        id: 3,
        value: 3,
        text: 'Good',
        icon: 'star-outline'
      },
      {
        id: 4,
        value: 4,
        text: 'Very Good',
        icon: 'star-outline'
      },
      {
        id: 5,
        value: 5,
        text: 'Excellent',
        icon: 'star-outline'
      },
    ];
    this.feedbackForm = this.formBuilder.group({
      order_id:['', Validators.required],
      text: [this.ratingStarts[2].text],
      rating: [this.ratingStarts[2].value],
      user_id: [this.userId]
    });
  }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders(){
    console.log('getting all orders');
    this.orders = this.localDB.getAllOrdersByUserId(ApiService.user.id, ORDER_STATUS.COMPLETED);
  }

  onFeedbackSubmit(){
    console.log('login form submit = ', this.feedbackForm.value);
    if(this.feedbackForm.invalid){
      // trigger form errors
      this.api.validateForm(this.feedbackForm);
      return false;
    }
    const feedData: any = this.feedbackForm.value;
    // service to be called for saving login data in database
    this.api.showLoader();
    setTimeout(() => {
      this.localDB.addFeedback(feedData)
      .then(() => {
        this.api.hideLoader();
        console.log('set feed = ');
        this.api.showToast('Feedback submitted successfully.');
        this.navCtrl.back();
      })
      .catch((err) => {
        this.api.hideLoader();
        console.log('err = ', err);
      });
    }, 1000);
  }

  rate(rs){
    console.log('rate = ', rs);
    this.selectedRate = rs;
    this.feedbackForm.controls['text'].setValue(rs.text);
    this.feedbackForm.controls['rating'].setValue(rs.value);
    this.ratingStarts.forEach((r) => {
      if(r.id <= rs.id) {
        r.icon = 'star';
      }
      else {
        r.icon = 'star-outline';
      }
    });
  }

}
