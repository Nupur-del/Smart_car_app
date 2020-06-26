import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect } from '@ionic/angular';
import { ApiService } from './../../services/api.service';
import { LocalDbService, OrderStatus, OrderInfo, Order, DELIVERY_PERSON_STATUS, ORDER_STATUS } from './../../services/local-db.service';
import { PopoverComponent } from '../../components/popover/popover.component';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.page.html',
  styleUrls: ['./view-orders.page.scss'],
})
export class ViewOrdersPage implements OnInit {

  @ViewChild('deliveryPersons') deliveryPersons: IonSelect;

  // orderStatusForm: FormGroup;
  private userId: number;
  ordersInfo: Array<OrderInfo> = [];
  ordStat: any = OrderStatus;
  orders: Array<Order>;
  userType: any;
  deliveries: any = [];
  delivery_person: any;
  deliverOptions: any;
  currentOrder: any;
  constructor(private api: ApiService, private localDB: LocalDbService, private navCtrl: NavController) { 
    console.log('api service = ', ApiService.user);
    this.userType = this.localDB.getSelectedUserType();
    this.userId = ApiService.user.id;
    this.deliverOptions = {
      header: 'Delivery Persons',
      subHeader: 'Select delivery person'
    };
  }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders(){
    console.log('user type = ', this.localDB.getSelectedUserType());
    if(this.userType == 2){
      this.orders = this.localDB.getAllOrdersByDealerId(this.userId);
      this.orders.forEach((order) => {
        const orderInfo: OrderInfo = this.localDB.getOrderDetails(order.id, this.userId);
        this.ordersInfo.push(orderInfo);
      });
      console.log('orders = ',this.ordersInfo);
    }
    else if(this.userType == 3){
      this.orders = this.localDB.getAllOrdersByDeliveryId(this.userId);
      this.orders.forEach((order) => {
        const orderInfo: OrderInfo = this.localDB.getOrderDetails(order.id, order.dealer_id);
        this.ordersInfo.push(orderInfo);
      });
      console.log('orders = ',this.ordersInfo);
    }
  }

  changeStatus(order:OrderInfo, status:number){
    console.log('update status ');
    this.localDB.setOrderStatus(order, status);
  }

  onDeliveryPersonSelected(){
    console.log('selected person = ', this.deliveryPersons.value);
    this.currentOrder.status = ORDER_STATUS.PROCESSING;
    this.changeStatus(this.currentOrder, ORDER_STATUS.PROCESSING);
    this.localDB.assignOrder(this.currentOrder, this.deliveryPersons.value);
  }

  openPopover(ev, order) {
    console.log('open popover');
    this.currentOrder = order;
    let data: any
    if (this.userType === 2){
      data = [
        {
          title:'Accept/Assign', // Mark as Processing
          disabled: (
            (order.status === ORDER_STATUS.PROCESSING) ||
            (order.status === ORDER_STATUS.OUT_FOR_DROP) ||
            (order.status === ORDER_STATUS.OUT_FOR_PICK) ||
            (order.status === ORDER_STATUS.COMPLETED) ||
            (order.status === ORDER_STATUS.CANCELLED)
          ),
          handler:() => {
            console.log('marking as processing');
            //get all delivery boys
            this.localDB.getAllDeliveries()
            .then((resp: any)=>{
              console.log('deliveries = ', resp);
              this.deliveries = resp.filter((del) => {
                return (del.status === DELIVERY_PERSON_STATUS.FREE);
              });
              if(this.deliveries.length > 0){
                setTimeout(() => {
                  this.deliveryPersons.open();
                }, 700);
              }
              else{
                this.api.showToast('No delivery person is available.');
              }
            })
            .catch((err: any)=>{
              console.log('err gettin deliveries = ', err);
            });
            this.api.hidePopover()
            .then(() => {
              console.log('popover hidden');
              // order.status = 1;  
              // this.changeStatus(order, 1);
            })
            .catch((err) => {
              console.log('err');
            });
          }
        },
        {
          title:'Out for drop',
          disabled: (
            (order.status === ORDER_STATUS.OUT_FOR_DROP) ||
            (order.status === ORDER_STATUS.COMPLETED) ||
            (order.status === ORDER_STATUS.CANCELLED)
          ),
          handler:() => {
            console.log('out for drop ');
            this.api.hidePopover()
            .then(() => {
              console.log('popover hidden');
              order.status = ORDER_STATUS.OUT_FOR_DROP;
              this.changeStatus(order, ORDER_STATUS.OUT_FOR_DROP);
              // this.localDB.releaseDeliveryPerson(order, this.deliveryPersons.value);
            })
            .catch((err) => {
              console.log('err');
            });
          }
        },
        {
          title:'Reject', // Cancel Order
          disabled: (
            (order.status === ORDER_STATUS.PROCESSING) ||
            (order.status === ORDER_STATUS.OUT_FOR_DROP) ||
            (order.status === ORDER_STATUS.OUT_FOR_PICK) ||
            (order.status === ORDER_STATUS.COMPLETED) ||
            (order.status === ORDER_STATUS.CANCELLED)
          ),
          handler:() => {
            console.log('marking as cancel order ');
            this.api.hidePopover()
            .then(() => {
              console.log('popover hidden');
              order.status = ORDER_STATUS.CANCELLED;
              this.changeStatus(order, ORDER_STATUS.CANCELLED);
            })
            .catch((err) => {
              console.log('err');
            });
          }
        },
      ];
    }
    else if (this.userType === 3){
      data = [
        {
          title:'Mark as Completed',
          disabled: (
            (order.status === ORDER_STATUS.COMPLETED)
          ),
          handler:() => {
            console.log('marking as completed ');
            this.api.hidePopover()
            .then(() => {
              console.log('popover hidden');
              order.status = ORDER_STATUS.COMPLETED;
              this.changeStatus(order, ORDER_STATUS.COMPLETED);
              this.localDB.releaseDeliveryPerson(this.userId);
            })
            .catch((err) => {
              console.log('err');
            });
          }
        },
        {
          title:'Out for pick',
          disabled: (order.status == ORDER_STATUS.OUT_FOR_PICK),
          handler:() => {
            console.log('out for drop ');
            this.api.hidePopover()
            .then(() => {
              console.log('popover hidden');
              order.status = ORDER_STATUS.OUT_FOR_PICK;
              this.changeStatus(order, ORDER_STATUS.OUT_FOR_PICK);
              // this.localDB.releaseDeliveryPerson(order, this.deliveryPersons.value);
            })
            .catch((err) => {
              console.log('err');
            });
          }
        },
      ];
    }
    this.api.showPopover(PopoverComponent, ev, {'options': data});
  }

}
