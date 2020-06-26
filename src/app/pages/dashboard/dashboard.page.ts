import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ApiService } from './../../services/api.service';
import { LocalDbService } from './../../services/local-db.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userType: any;
  constructor(private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController, private events: Events) { 
    console.log('user type = ', this.userType);
    this.localDB.getUserInfo()
    .then((user:any)=>{
      console.log('current user = ', user);
      ApiService.user = user;
      if(!user){
        this.navCtrl.navigateRoot('/welcome');
        this.events.publish('app:logout');
      }
      this.localDB.setSelectedUserType(user.user_type);
      this.userType = user.user_type || this.localDB.getSelectedUserType().id || '1';
      this.events.publish('app:login', user);
    })
    .catch((err:any)=>{
      console.log('user info err = ', err);
    });
  }

  ngOnInit() {
  }

  addCar(){
    console.log('navigate to add car form');
    this.navCtrl.navigateForward('/add-car');
  }

  addOrder(){
    console.log('navigate to add order');
    this.navCtrl.navigateForward('/new-order');
  }

  trackOrder(){
    console.log('navigate to track order');
    this.navCtrl.navigateForward('/track-order');
  }
  
  addFeedback(){
    console.log('navigate to add feedback');
    this.navCtrl.navigateForward('/feedback');
  }

  viewOrders(){
    console.log('view orders');
    this.navCtrl.navigateForward('/view-orders');
  }
  
  viewFeedbacks(){
    console.log('view orders');
    this.navCtrl.navigateForward('/view-feedbacks');
  }
  
}
