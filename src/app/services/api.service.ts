import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastController, LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { ToastOptions, PopoverOptions } from '@ionic/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalDbService } from 'D:/ionic projects/car-mechanics_mongo/src/app/services/local-db.service';
import { Observable } from 'rxjs';

export interface User {
  uid: number;
  name: string;
  email: string;
  mobile: string;
  gender: number;
  address: string;
  password: string;
  user_type: number;
}
export interface UserProfile {
  uid: number;
  name: string;
  gender: number;
  address: string;
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
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  static user:any;
  static isLoading:boolean;
  static isToast:boolean;

  loader:any;
  toast:any;
  alert:any;
  popover: any;

  usersCount:number = 0;
  carsCount:number = 0;
  cars:Array<Car>=[];
  userDetails:number;
  services:Array<Service>=[
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
    dealers:Array<Dealer>=[
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

  constructor(
    private loadCtrl:LoadingController, 
    private localDB:LocalDbService,
    private toastCtrl:ToastController, 
    private alertCtrl: AlertController, 
    private popoverCtrl:PopoverController,
    private http: HttpClient
    ) { 

      this.http.get(environment.BASE_URL + environment.API_USERS)
      .subscribe((resp:any)=>{
        console.log('users length = ',resp);
        if(resp.statusCode == 1){
          this.usersCount = resp.data.length;
        }
      },
      (err)=>{
        console.log('error = ',err);
      }),
      this.http.get(environment.BASE_URL + environment.API_CARS)
      .subscribe((resp:any)=>{
        console.log('car length = ',resp);
        if(resp.statusCode == 1){
          this.carsCount = resp.data.length;
        }
      },
      (err)=>{
        console.log('error = ',err);
      }),
      this.localDB.getUserInfo()
      .then((data:any)=>{
        console.log('current user = ', data);
        this.userDetails = data.uid;
        console.log('userDetails', this.userDetails);
      }).catch(err => {
        console.log('user info err = ', err);
      });
    }
  validateForm(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach((field) => {
      let control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateForm(control);
      }
    });
  }

  /**
   * Display loading.
   * @param msg - Display the message in loader
   */
  public async showLoader(msg?:string){
    if(!ApiService.isLoading){
      ApiService.isLoading = true;
      console.log('show loader');
      let defaultMsg:string = '';
      return await this.loadCtrl.create({
        message: msg || defaultMsg,
        duration: 15000
      })
      .then((loaderHTML:HTMLIonLoadingElement)=>{
        loaderHTML.onDidDismiss().then(()=>{
          console.log('dismissal done');
        });
        loaderHTML.onWillDismiss().then(()=>{
          console.log('will be dismissed soon');
        });
        loaderHTML.present().then(()=>{
          console.log('presented');
          console.log('presented = ', ApiService.isLoading);
          if(!ApiService.isLoading){
            loaderHTML.dismiss()
            .then(()=>{
              console.log('aborting present');
              console.log('aborting present');
            });
          }
        })
        .catch((err)=>{
          console.log('loading present err = ', err);
          console.log('loading present err = ', err);
        });
      })
      .catch((err)=>{
        console.log('loading create err = ', err);
        console.log('loading create err = ', err);
      });
    }
  }
 
  /**
   * Hide current loader. 
   */
  public async hideLoader(){
    ApiService.isLoading = false;
    console.log('hide loader');
    return await this.loadCtrl.dismiss()
    .then(()=>{
      console.log('loader dismissed');
      console.log('loader dismissed');
    })
    .catch((err)=>{
      console.log('loading dismiss err = ', err);
      console.log('loading dismiss err = ', err);
    });
  }

  /**
   * Display custom alert.
   * @param header - Optional. Displays header.
   * @param subHeader - Optional. Displays subheader.
   * @param message - Optional. Displays message.
   * @param btns - Optional. Displays buttons in alert box send as arrays.
   * @param type - Optional. To set the type of alert to be shown. Sets type from appConfig.ALERT_TYPES
   * @param inputVal - Optional. Set the inital value of input for prompt if any.
   */
  public async showAlert(header?:string, subHeader?:string, message?:string, btns?:any){
    this.alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      cssClass: 'ques-alert',
      message: message,
      buttons: btns || [{
        text: 'Close',
        role: 'cancel',
        cssClass: 'cancel-btn',
        handler: () => {
          console.log('Cancel = ');
          return false;
        } 
      },
      {
        text: 'OK',
        cssClass: 'ok-btn',
        handler: () => {
          console.log('ok button');
        }
      }],
      inputs: undefined
    });
    await this.alert.present();
  }

  /**
   * Hide current alert forcefully.
   */
  // public async hideAlert(){
  //   await this.alert.dismiss();
  // }

  /**
   * Display toast with user defined message.
   * @param msg 
   */
  public async showToast(msg?:string, css?:string){
    if(!ApiService.isToast){
      let opts:any = environment.TOAST_SETTINGS;
      if(msg){
        opts.message = msg;
      }
      if(css){
        opts.cssClass = css;
      }
      await this.toastCtrl.create(opts)
      .then((toastHTML:HTMLIonToastElement)=>{
        toastHTML.onDidDismiss()
        .then(()=>{
          ApiService.isToast = false;
        })
        .catch((err)=>{
        });
        toastHTML.present()
        .then(()=>{
          ApiService.isToast = true;
        })
        .catch((err)=>{
        });
      }); 
    }
  }

  /**
   * Display popover with a particular component UI
   * @param component - The component to be loaded in popover
   * @param ev - The event to be transfered to the popover to position it with repsect to the
   * element clicked.
   * @param data - The menu options data to be transfered to the popover to show the list of 
   * menu options.
   */
  public async showPopover(component: any, ev:any, data:any, options?:any){
    const opts: PopoverOptions = {
      event: ev,
      component: component,
      translucent: true,
      showBackdrop: true,
      componentProps: data
    }
    if(options && options.css){
      opts.cssClass = options.css;
    }
    this.popover = await this.popoverCtrl.create(opts);
    await this.popover.present();
  }

  /**
   * Hide current popover forcefully.
   */
  public async hidePopover(){
    await this.popover.dismiss();
  }

  getUserTypes() {
    return new Observable((observable) => {
      this.http.get(environment.BASE_URL + environment.API_USER_TYPES)
      .subscribe(
        (resp) => {
          console.log('response = resp');
          observable.next(resp);
          observable.complete();
        },
        (err:any) => {
          observable.error(err);
          observable.complete();
        }
      );
    });
  }
  
  getLastUserId():number{
  return ((this.usersCount > 0) ? this.usersCount : 0);
  }

  addUser(userData:any) {
     let user:User = {
     uid: (this.getLastUserId()+1),
     name: userData.name,
     email:userData.email,
     mobile:userData.mobile,
     password:userData.password,
     gender:userData.gender,
     address:userData.address,
     user_type:userData.userType
    }
    return new Observable((observable) => {
      this.http.post<any>(environment.BASE_URL + environment.API_USERS, user,
        { headers : new HttpHeaders({'Content-type' : 'application/json'})
      })
      .subscribe(
        (resp) => {
          console.log('response = resp');
          observable.next(resp);
          observable.complete();
        },
        (err:any) => {
          observable.error(err);
          observable.complete();
        }
      );
    });
  }
  editUser(userData:any){
    let user:UserProfile = {
      uid: userData.uid,
      name: userData.name,
      gender:userData.gender,
      address:userData.address,
      user_type:userData.userType
     }
     return new Observable((observable) => {
       this.http.post<any>(environment.BASE_URL + environment.API_PROFILE, user,
         { headers : new HttpHeaders({'Content-type' : 'application/json'})
       })
       .subscribe(
         (resp) => {
           console.log('response = resp');
           observable.next(resp);
           observable.complete();
         },
         (err:any) => {
           observable.error(err);
           observable.complete();
         }
       );
     });
  }
  checkForUser(userData:any):any{
    let body:any = {
      username:userData.username,
      password:userData.password
     }
    return new Observable((observable) => {
      this.http.post<any>(environment.BASE_URL + environment.API_CREDS, body, 
        { headers : new HttpHeaders({'Content-type' : 'application/json'})
        })
      .subscribe(
        (resp) => {
          console.log('response = resp');
          observable.next(resp);
          observable.complete();
        },
        (err:any) => {
          observable.error(err);
          observable.complete();
        }
      );
    });
  }
  getLastCarId():number{
  return ((this.carsCount > 0) ? this.carsCount : 0);
  }

  addCar(carData:any){
    console.log('cars = ', this.cars);
    if(!this.cars){
      this.cars = [];
    }
    let body:Car = {
      id: (this.getLastCarId() + 1),
      uid: this.userDetails,
      //uid : carData.uid,
      model: carData.model,
      registration_number: carData.registration_number
    };
    return new Observable((observable) => {
      this.http.post<any>(environment.BASE_URL + environment.API_CARS, body,
        { headers : new HttpHeaders({'Content-type' : 'application/json'})
      })
      .subscribe(
        (resp) => {
          console.log('response = resp');
          observable.next(resp);
          observable.complete();
        },
        (err:any) => {
          observable.error(err);
          observable.complete();
        }
      );
    });
  }
  private createOrderNumber() {
    return 'ORD' + (new Date().getTime());
  }

  getAllCarsByUserId(userId:any){
    let body:any = {
        uid : userId
    }
    return new Observable((observable) => {
      this.http.post<any>(environment.BASE_URL + environment.API_CARS_USERS, body,
        { headers : new HttpHeaders({'Content-type' : 'application/json'})
        })
      .subscribe(
        (resp) => {
          console.log('response = resp');
          observable.next(resp);
          observable.complete();
        },
        (err:any) => {
          observable.error(err);
          observable.complete();
        }
      );
    });
  }
  addOrder(orderData:any){
    let body: Order = {
      id: this.createOrderNumber(),
      dealer_id: orderData.dealer,
      user_id: this.userDetails,
      service_id: (!(orderData.service.length) ? [orderData.service] : orderData.service),
      status: ORDER_STATUS.PLACED,
      timestamp: (new Date()),
      total_amount: orderData.amount,
      car_id: orderData.car
    };
    return new Observable((observable) => {
      this.http.post<any>(environment.BASE_URL + environment.API_ORDERS, body,
        { headers : new HttpHeaders({'Content-type' : 'application/json'})
      })
      .subscribe(
        (resp) => {
          console.log('response = resp');
          observable.next(resp);
          observable.complete();
        },
        (err:any) => {
          observable.error(err);
          observable.complete();
        }
      );
    });
  }
  getAllOrdersByUserId(userId:any){
    let body:any = {
      uid : userId
  }
  return new Observable((observable) => {
    this.http.post<any>(environment.BASE_URL + environment.API_ORDERS_USERID, body,
      { headers : new HttpHeaders({'Content-type' : 'application/json'})
      })
    .subscribe(
      (resp) => {
        console.log('response = resp');
        observable.next(resp);
        observable.complete();
      },
      (err:any) => {
        observable.error(err);
        observable.complete();
      }
    );
  });
  }
}
