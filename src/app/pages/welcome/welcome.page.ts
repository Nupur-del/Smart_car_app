import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalDbService } from '../../services/local-db.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  selectedUserType:any = 1;
  userTypes:Array<any>;
  constructor(private localDB:LocalDbService, private navCtrl:NavController, private api: ApiService) { }

  ngOnInit() {
    // this.userTypes = this.localDB.userTypes;
    this.getUserTypes();
    // setTimeout(()=>{
    //   this.localDB.getUserTypes()
    //   .then((val:any)=>{
    //     console.log('user types = ', val);
    //     this.userTypes = val;
    //   })
    //   .catch((err)=>{
    //     console.log('err = ', err);
    //   });
    // }, 2000);
  }
  
  getUserTypes(){
    this.api.showLoader();
    this.api.getUserTypes()
    .subscribe(
      (resp:any) => {
        console.log('resp = ', resp);
        if(resp.statusCode == 1 && resp.data){
          this.userTypes = resp.data;
        }
        else{
          this.api.showToast(resp.message);
        }
        this.api.hideLoader();
      },
      (err:any) => {
        console.log('err = ', err);
        this.api.hideLoader();
      }
    );
  }

  goToLogin(){
    console.log('navigating to login = ', this.selectedUserType);
    let userType:any = this.userTypes.find((ut)=>{
      return (ut.id == this.selectedUserType) ? ut : null;
    });
    console.log('user type = ', userType);
    this.localDB.setSelectedUserType(userType);
    this.navCtrl.navigateRoot('/login');
  }

}
