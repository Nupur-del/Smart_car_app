import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface UserType{
  id:number,
  type:string,
  status:boolean
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  gender: number;
  address: string;
  password: string;
  user_type: number;
}

export interface Car {
  id: number;
  uid: number;
  model: string;
  registration_number: string;
}

export interface Service{
  id:number,
  name:string,
  amount:number
}

export interface Dealer{
  id: number;
  company_name: string;
  opening_time: string;
  closing_time: string;
  email: string;
  contact_no: string;
  address: string;
  city: string;
  pincode: string;
  password: string;
  services?: Array<Service>;
  user_type: number;
}

export const enum DELIVERY_PERSON_STATUS{'FREE', 'BUSY'}

export interface Delivery {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  gender: number;
  address: string;
  password: string;
  user_type: number;
  status:DELIVERY_PERSON_STATUS;
  orderId?:string;
}

// export interface DealerInfo{ // for storing complete details of dealers including password
//   id:number,
//   company_name:string,
//   opening_time:string,
//   closing_time:string,
//   email:string,
//   contact_no:string,
//   address:string,
//   city:string,
//   pincode:string,
//   password: string,
//   services:Array<Service>
// }

export const enum ORDER_STATUS{'PLACED', 'PROCESSING', 'CANCELLED', 'COMPLETED', 'OUT_FOR_DROP', 'OUT_FOR_PICK'}

export const OrderStatus = ['Placed', 'Processing', 'Cancelled', 'Completed', 'Out for drop', 'Out for pick'];

export interface Order {
  id: string;
  user_id: number;
  dealer_id: number;
  service_id: Array<number>;
  status: ORDER_STATUS;
  timestamp: Date;
  total_amount: number;
  car_id: number;
}

export interface OrderInfo {
  id: string;
  dealer_id: Dealer;
  delivery_id?: Delivery;
  user_id?: User;
  service_id: Array<Service>;
  status: ORDER_STATUS;
  timestamp: Date;
  total_amount: number;
  car_id: Car;
  feedbacks?: Array<Feedback>;
  avgRating?: number;
}

export interface Feedback {
  id: number;
  order_id: string;
  user_id: number;
  feed_text: string;
  feed_rating: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})

export class LocalDbService {

  private TABLE_CURRENT_USER_INFO:string = 'userInfo';
  private TABLE_USERS:string = 'users';
  private TABLE_USER_TYPES:string = 'userTypes';
  private TABLE_CARS:string = 'cars';
  private TABLE_APP_INSTALL:string = 'firstInstall';
  private TABLE_DEALERS:string = 'dealers';
  private TABLE_SERVICES:string = 'services';
  private TABLE_ORDERS:string = 'orders';
  private TABLE_DELIVERIES:string = 'deliveries';
  private TABLE_FEEDBACKS: string = 'feedbacks';

  private users:Array<User>=[];
  private cars:Array<Car>=[];
  private orders:Array<Order>=[];
  private deliveries:Array<Delivery>=[];
  private feedbacks: Array<Feedback> = [];
  userTypes:Array<UserType>=[
    {
      id:1,
      type:'Customer',
      status:true
    },
    {
      id:2,
      type:'Dealer',
      status:true
    },
    {
      id:3,
      type:'Delivery',
      status:true
    }
  ];
  private selectedUserType:UserType;
  private services:Array<Service>=[
    {
      id:1,
      name:"Car Washing 1",
      amount:1500
    },
    {
      id:2,
      name:"Applying Graphics 1",
      amount:2000
    },
    {
      id:3,
      name:"Oil Change 1",
      amount:500
    },
    {
      id:4,
      name:"Car Washing 2",
      amount:1700
    },
    {
      id:5,
      name:"Applying Graphics 2",
      amount:2200
    },
    {
      id:6,
      name:"Applying Graphics 3",
      amount:1800
    },
    {
      id:7,
      name:"Oil Change 3",
      amount:400
    },
  ]
  private dealers:Array<Dealer>=[
    {
      id:1,
      company_name:"Dealer 1",
      opening_time:"10:00",
      closing_time:"17:00",
      email:"dealer1@deal.com",
      contact_no:"1234567890",
      address:"test address 1",
      city:"Lucknow",
      pincode:"226001",
      password:'123456',
      user_type:2,
      services:[
        this.services[0],
        this.services[1],
        this.services[2]
      ]
    },
    {
      id:2,
      company_name:"Dealer 2",
      opening_time:"09:30",
      closing_time:"17:00",
      email:"dealer2@test.com",
      contact_no:"2134567890",
      address:"test address 2",
      city:"Mathura",
      pincode:"326001",
      password:'123456',
      user_type:2,
      services:[
        this.services[3],
        this.services[4]
      ]
    },
    {
      id:3,
      company_name:"Dealer 3",
      opening_time:"10:30",
      closing_time:"17:30",
      email:"dealer3@test.com",
      contact_no:"2334567890",
      address:"test address 3",
      city:"Jhansi",
      pincode:"426001",
      password:'123456',
      user_type:2,
      services:[
        this.services[5],
        this.services[6]
      ]
    },
  ];

  constructor(private storage:Storage) { 
    this.storage.get(this.TABLE_APP_INSTALL)
    .then((val:any)=>{
      console.log('is first install = ', val);
      if (!val) {
        // this.clearTables()
        // .then((val:any) => {
        //   console.log('val = ', val);
        //   this.createTables();
        // })
        // .catch((err) => {
        //   console.log('err = ', err);
        // });
        this.createTables();
      }
      else{
        // this.storage.set(this.TABLE_ORDERS, []);
        this.storage.get(this.TABLE_USERS)
        .then((val:any)=>{
          console.log('users val = ', val);
          this.users = val;
        })
        .catch((err)=>{
          console.log('err = ',err);
        });
        this.storage.get(this.TABLE_DEALERS)
        .then((val:any)=>{
          console.log('dealers val = ', val);
          this.dealers = val;
        })
        .catch((err)=>{
          console.log('err = ',err);
        });
        this.storage.get(this.TABLE_DELIVERIES)
        .then((val:any)=>{
          console.log('deliveries val = ', val);
          this.deliveries = val;
        })
        .catch((err)=>{
          console.log('err = ',err);
        });
        this.storage.get(this.TABLE_CARS)
        .then((val:any)=>{
          this.cars = val;
          if(!val){
            this.storage.set(this.TABLE_CARS,[]); // For storing car info
          }
        })
        .catch((err)=>{
          console.log('err = ',err);
        });
        this.storage.get(this.TABLE_ORDERS)
        .then((val:any)=>{
          this.orders = val;
          if(!val){
            this.storage.set(this.TABLE_ORDERS,[]); // For storing car info
          }
        })
        .catch((err)=>{
          console.log('err = ',err);
        });
        this.storage.get(this.TABLE_FEEDBACKS)
        .then((val:any)=>{
          console.log('feedbacks val = ', val);
          this.feedbacks = val;
        })
        .catch((err)=>{
          console.log('err = ',err);
        });
      }
    })
    .catch((err)=>{
      console.log('err = ',err);
    });
  }

  createTables(){
    this.storage.set(this.TABLE_APP_INSTALL, true);
    this.storage.set(this.TABLE_CURRENT_USER_INFO, null);
    this.storage.set(this.TABLE_USERS, []); // For storing registered users
    this.storage.set(this.TABLE_USER_TYPES, this.userTypes); // For storing user types
    this.storage.set(this.TABLE_CARS, []); // For storing car info
    this.storage.set(this.TABLE_DEALERS, this.dealers); // For storing dealers info
    this.storage.set(this.TABLE_SERVICES, this.services); // For storing services info
    this.storage.set(this.TABLE_ORDERS, []); // For storing orders info
    this.storage.set(this.TABLE_DELIVERIES, []); // For storing orders info
    this.storage.set(this.TABLE_FEEDBACKS, []); // For orders feedbacks
  }

  // Caution: To be used for development purpose 
  clearTables() {
    console.log('clearing all tables');
    return this.storage.clear();
  }

  // For setting current user after login
  setUserInfo(userData:any){
    this.storage.set(this.TABLE_CURRENT_USER_INFO, userData);
  }
  
  // For getting logged in user
  getUserInfo(){
    return this.storage.get(this.TABLE_CURRENT_USER_INFO);
  }
  
  // For removing current logged in user
  removeUserInfo(){
    return this.storage.set(this.TABLE_CURRENT_USER_INFO, null);
  }

  // For checking the user that is about to login
  checkForUser(userData:any):any{
    return this.users.find((user:any,i)=>{
      return (((user.email == userData.username || user.mobile == userData.username) && (user.password == userData.password)));
    });
  }
  
  // For checking the dealer that is about to login
  checkForDealer(dealerData:any):any{
    return this.dealers.find((dealer:any,i)=>{
      return (((dealer.email === dealerData.username || dealer.contact_no == dealerData.username) && (dealer.password == dealerData.password)))
    });
  }
  
  // For checking the delivery user that is about to login
  checkForDelivery(deliveryData:any):any{
    return this.deliveries.find((delivery:any,i)=>{
      return (((delivery.email === deliveryData.username || delivery.contact_no == deliveryData.username) && (delivery.password == deliveryData.password)))
    });
  }

  private getLastUserId():number{
    return ((this.users && this.users.length > 0) ? this.users[this.users.length - 1].id : 0);
  }
  
  private getLastCarId(): number {
    return ((this.cars && this.cars.length > 0) ? this.cars[this.cars.length - 1].id : 0);
  }
  
  private getLastDealerId(): number {
    return ((this.dealers && this.dealers.length > 0) ? this.dealers[this.dealers.length - 1].id : 0);
  }
  
  private getLastDeliveryId(): number {
    return ((this.deliveries && this.deliveries.length > 0) ? this.deliveries[this.deliveries.length - 1].id : 0);
  }
  
  private getLastFeedbackId(): number {
    return ((this.feedbacks && this.feedbacks.length > 0) ? this.feedbacks[this.feedbacks.length - 1].id : 0);
  }

  // Adding new user after registration
  addUser(userData:any){
    console.log('this.users  = ', this.users);
    if(!this.users){
      this.users = [];
    }
    let user:User = {
      id: (this.getLastUserId()+1),
      name: userData.name,
      email:userData.email,
      mobile:userData.mobile,
      password:userData.password,
      gender:userData.gender,
      address:userData.address,
      user_type:userData.userType
    }
    this.users.push(user);
    return this.storage.set(this.TABLE_USERS, this.users);
  }
  
  // Adding new car for current user
  addCar(carData:any){
    console.log('cars = ', this.cars);
    if(!this.cars){
      this.cars = [];
    }
    const car: Car = {
      id: (this.getLastCarId() + 1),
      uid: carData.uid,
      model: carData.model,
      registration_number: carData.registration_number
    };
    this.cars.push(car);
    return this.storage.set(this.TABLE_CARS, this.cars);
  }

  public getUserTypes(){
    return this.storage.get(this.TABLE_USER_TYPES);
  }

  setSelectedUserType(userType:any){
    this.selectedUserType = userType;
  }

  getSelectedUserType(){
    return this.selectedUserType;
  }

  getAllCarsByUserId(userId:number):Array<Car>{
    console.log('cars of user = ', userId);
    return this.cars.filter((car,i)=>{
      return ((car.uid === userId) ? car : undefined)
    });
  }
  
  getAllOrdersByUserId(userId:number, status?: ORDER_STATUS):Array<Order>{
    console.log('orders of user = ', userId);
    return this.orders.filter((order, i) => {
      if(status){
        return (((order.user_id === userId) && (order.status === status)) ? order : undefined);
      }
      else{
        return (((order.user_id === userId)) ? order : undefined);
      }
    });
  }
  
  getAllOrdersByDealerId(dealerId:number):Array<Order>{
    console.log('orders of dealer = ', dealerId);
    return this.orders.filter((order, i) => {
      return ((order.dealer_id === dealerId));
    });
  }
  
  getAllOrdersByDeliveryId(deliveryId:number): Array<Order>{
    console.log('orders of dealer = ', deliveryId);
    let orderId: string;
    let orders: Array<Order> = [];
    this.deliveries.forEach((del:Delivery) => {
      if(del.id === deliveryId){
        orderId = del.orderId;
        return;
      }
    });
    orders = this.orders.filter((order, i) => {
      return ((order.id === orderId));
    });
    return orders;
  }

  getAllDealers(){
    console.log('getting all dealers');
    return this.storage.get(this.TABLE_DEALERS)
  }
  
  getAllDeliveries(){
    console.log('getting all deliveries');
    return this.storage.get(this.TABLE_DELIVERIES);
  }

  // Adding new order for current user
  addOrder(orderData:any){
    // console.log('cars = ',this.cars);
    if (!this.orders) {
      this.orders = [];
    }
    const order: Order = {
      id: this.createOrderNumber(),
      dealer_id: orderData.dealer,
      user_id: orderData.uid,
      service_id: (!(orderData.service.length) ? [orderData.service] : orderData.service),
      status: ORDER_STATUS.PLACED,
      timestamp: (new Date()),
      total_amount: orderData.amount,
      car_id: orderData.car
    };
    this.orders.push(order);
    return this.storage.set(this.TABLE_ORDERS, this.orders);
  }

  private createOrderNumber() {
    return 'ORD' + (new Date().getTime());
  }

  setOrderStatus(orderInfo:OrderInfo, status:ORDER_STATUS){
    this.orders.forEach((order) => {
      if(orderInfo.id == order.id){
        order.status = status;
      }
    });
    this.storage.set(this.TABLE_ORDERS, this.orders);
  }
  
  assignOrder(orderInfo:OrderInfo, deliveryPId:number){
    this.deliveries.forEach((dp) => {
      if(dp.id == deliveryPId){
        dp.status = DELIVERY_PERSON_STATUS.BUSY;
        dp.orderId = orderInfo.id;
      }
    });
    this.storage.set(this.TABLE_DELIVERIES, this.deliveries);
  }
  
  releaseDeliveryPerson(deliveryPId:number){
    console.log('dp id = ', deliveryPId);
    this.deliveries.forEach((dp) => {
      if(dp.id == deliveryPId){
        dp.status = DELIVERY_PERSON_STATUS.FREE;
        dp.orderId = '';
      }
    });
    console.log('done free');
    this.storage.set(this.TABLE_DELIVERIES, this.deliveries);
  }

  getOrderStatus(orderId: string, userId: number) {
    const order: Order = this.orders.find((or) => {
      return (((or.id === orderId) && (or.user_id === userId)));
    });
    const dealer: Dealer = this.dealers.find((deal) => {
      return ((deal.id === order.dealer_id));
    });
    let services: Array<Service> = [];
    if(order.service_id && order.service_id.length){
      services = this.services.filter((serv) => {
        return ((order.service_id.indexOf(serv.id) !== -1));
      });
    }
    else{
      // this.services.forEach((serv) => {
      //   if((order.service_id == serv.id)){
      //     services.push(serv)
      //   }
      // });
    }
    const car: Car = this.cars.find((cr) => {
      return ((cr.id === order.car_id));
    });
    const orderInfo: OrderInfo = {
      id: order.id,
      dealer_id: dealer,
      service_id: services,
      car_id: car,
      status: order.status,
      timestamp: order.timestamp,
      total_amount: order.total_amount
    };
    return orderInfo;
  }
  
  getOrderDetails(orderId: string, dealerId: number) {
    const order: Order = this.orders.find((or) => {
      return (((or.id === orderId) && (or.dealer_id === dealerId)));
    });
    const dealer: Dealer = this.dealers.find((deal) => {
      return ((deal.id === order.dealer_id));
    });
    const services: Array<Service> = this.services.filter((serv) => {
      if(order.service_id instanceof Array){
        return ((order.service_id.indexOf(serv.id) !== -1));
      }
      else{
        return ((order.service_id == serv.id));
      }
    });
    const car: Car = this.cars.find((cr) => {
      return ((cr.id === order.car_id));
    });
    let avg_rating: number = 0;
    const feeds: Array<Feedback> = [];
    // console.log('feedback = ', this.feedbacks);
    this.feedbacks.forEach((feed) => {
      // return ((feed.order_id === order.id) && (feed.user_id === order.user_id));
      // console.log('feed = ', feed);
      if(feed.order_id == order.id){
        avg_rating += (feed.feed_rating);
        feeds.push(feed);
      }
      // return ((feed.order_id === order.id));
    });
    // console.log('feeds = ', feeds);
    const delivery: Delivery = this.deliveries.find((del) =>{
      return (del.orderId === orderId);
    });
    const user: User = this.users.find((user) => {
      return ((user.id === order.user_id));
    });
    console.log('avg = ', avg_rating);
    const orderInfo: OrderInfo = {
      id: order.id,
      dealer_id: dealer,
      delivery_id: delivery,
      user_id: user,
      service_id: services,
      car_id: car,
      status: order.status,
      timestamp: order.timestamp,
      total_amount: order.total_amount,
      feedbacks: feeds,
      avgRating: ((feeds.length === 0) ? 0 : (avg_rating / feeds.length))
    };
    return orderInfo;
  }

  // Adding new dealer after registration
  addDealer(dealerData:any){
    console.log('this.users  = ', this.dealers);
    if(!this.dealers){
      this.dealers = [];
    }
    const dealer: Dealer = {
      id: (this.getLastDealerId() + 1),
      company_name: dealerData.company_name,
      email: dealerData.email,
      contact_no: dealerData.contact_no,
      password: dealerData.password,
      pincode: dealerData.pincode,
      address: dealerData.address,
      user_type: dealerData.userType,
      city: dealerData.city,
      opening_time: dealerData.opening_time,
      closing_time: dealerData.closing_time,
    }
    this.dealers.push(dealer);
    return this.storage.set(this.TABLE_DEALERS, this.dealers);
  }
  
  // Adding new delivery after registration
  addDelivery(deliveryData:any){
    console.log('this.delivery  = ', this.deliveries);
    if(!this.deliveries){
      this.deliveries = [];
    }
    const delivery: Delivery = {
      id: (this.getLastDeliveryId() + 1),
      name: deliveryData.name,
      email: deliveryData.email,
      contact_no: deliveryData.contact_no,
      password: deliveryData.password,
      address: deliveryData.address,
      gender: deliveryData.gender,
      user_type: deliveryData.userType,
      status: DELIVERY_PERSON_STATUS.FREE
    }
    this.deliveries.push(delivery);
    return this.storage.set(this.TABLE_DELIVERIES, this.deliveries);
  }

  addFeedback(feedData: any) {
    console.log(' adding feedback ', this.feedbacks);
    if(!this.feedbacks){
      this.feedbacks = [];
    }
    const feed: Feedback = {
      id: (this.getLastFeedbackId() + 1),
      order_id: feedData.order_id,
      feed_text: feedData.text,
      feed_rating: feedData.rating,
      timestamp: new Date(),
      user_id: feedData.user_id
    };
    this.feedbacks.push(feed);
    return this.storage.set(this.TABLE_FEEDBACKS, this.feedbacks);
  }

}
