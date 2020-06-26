import { Component } from '@angular/core';
import { Events, NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { LocalDbService } from './services/local-db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  isLoggedIn: boolean;
  userType: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events:Events, 
    private api: ApiService, 
    private localDB:LocalDbService, private navCtrl:NavController
  ) {
    this.initializeApp();
    this.events.subscribe('app:login',(user: any)=>{
      console.log('user logged in change menu = ',user);
      this.userType = user.user_type;
      this.localDB.setUserInfo(user);
      this.isLoggedIn = true;
    });
    this.events.subscribe('app:logout',()=>{
      console.log('user logged out = ');
      this.isLoggedIn = false;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onEditProfile(){
    console.log('edit profile');
    this.navCtrl.navigateForward('/edit-profile');
  }

  onLogout(){
    console.log('logging out');
    let btns:any = [
      {
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
          this.localDB.removeUserInfo()
          .then((resp)=>{
            console.log('log out success resp = ',resp);
            this.events.publish('app:logout');
            this.navCtrl.navigateRoot('/login');
          })
          .catch((err)=>{
            console.log('err = ',err);
          });
        }
      }
    ]
    this.api.showAlert('Logout', '', 'Are you sure you want to logout?', btns);
  }
}
