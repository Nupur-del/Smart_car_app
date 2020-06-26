import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from './../../services/api.service';
import { LocalDbService, OrderStatus, OrderInfo, Order } from './../../services/local-db.service';
import { PopoverComponent } from '../../components/popover/popover.component';

@Component({
  selector: 'app-view-feedbacks',
  templateUrl: './view-feedbacks.page.html',
  styleUrls: ['./view-feedbacks.page.scss'],
})
export class ViewFeedbacksPage implements OnInit {

  private userId: number;
  ordersInfo: Array<OrderInfo> = [];
  ordStat: any = OrderStatus;
  orders: Array<Order>;
  constructor(private api:ApiService, private localDB:LocalDbService, private navCtrl:NavController) { 
    console.log('api service = ', ApiService.user);
    this.userId = ApiService.user.id;
  }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders(){
    console.log('');
    this.orders = this.localDB.getAllOrdersByDealerId(this.userId);
    this.orders.forEach((order) => {
      const orderInfo: OrderInfo = this.localDB.getOrderDetails(order.id, this.userId);
      this.ordersInfo.push(orderInfo);
    });
    console.log('orders = ',this.ordersInfo);
  }

}
