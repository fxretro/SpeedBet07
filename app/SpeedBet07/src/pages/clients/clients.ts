import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import "rxjs/add/operator/debounceTime";
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataTextProvider } from '../../providers/data-text/data-text'
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html',
})
export class ClientsPage {

  usersWorkers: Observable<any>;
  usersArray: any = []
  client: any
  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;
  orderType: any

  constructor(
    public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public dataInfo: DataInfoProvider,
    public db: DatabaseProvider,
    public platform: Platform,
    public auth: AuthProvider,
    public dataText: DataTextProvider,
    public httpd: HttpdProvider,
    public actionsheetCtrl: ActionSheetController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {    

    this.orderType = "1"

    if(this.dataInfo.isHome)
      this.reload()    
    else
      this.navCtrl.setRoot('LoginPage')          
  }

  reload(){
    
    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present()

    this.usersWorkers = this.db.getClients()

    let sub = this.usersWorkers.subscribe(data => {

        sub.unsubscribe()
        this.reloadCallback(data)
        loading.dismiss()        
    });
  }

  reloadCallback(data){
    
    this.usersArray = []

    data.forEach(element => {

      let info = element.payload.val()
      info.key = element.payload.key
      info.lastDatetimeStr = moment(info.lastDatetime).format("DD/MM/YYYY hh:mm:ss")  
      
  
      this.usersArray.push(info)
    });    

    this.checkOrder()
  }
  

  checkOrder(){

    if(this.orderType === "1"){
        this.orderAlpha()    
    }
    
    else if(this.orderType === "2"){
      this.orderAlphaDesc()    
    }

    else if(this.orderType === "3"){
      this.orderDatetime()    
    }

    else if(this.orderType === "4"){
      this.orderAccess()    
    }

    else {
      this.uiUtils.showToast(this.dataText.errorFilter)
    }

  }

  orderAlpha(){

    let tmp = this.usersArray.sort(function(a,b) {

      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;

    })    


    this.usersArray = tmp
  }

  orderAlphaDesc(){

    let tmp = this.usersArray.sort(function(a,b) {

      if(a.name > b.name) { return -1; }
      if(a.name < b.name) { return 1; }
      return 0;

    })    


    this.usersArray = tmp
  }

  orderDatetime(){

    let tmp = this.usersArray.sort(function(a,b) {

      if(a.datetime < b.datetime) { return -1; }
      if(a.datetime > b.datetime) { return 1; }
      return 0;

    })    


    this.usersArray = tmp
  }


  orderAccess(){

    let tmp = this.usersArray.sort(function(a,b) {

      
      if(a.lastDatetime && b.lastDatetime){
        if(a.lastDatetime > b.lastDatetime) { return -1; }
        if(a.lastDatetime < b.lastDatetime) { return 1; }
      }
      
      return 0;

    })    


    this.usersArray = tmp
  }

    
  
  addClient(){
    this.navCtrl.push('ClientsAddPage')
  }

  

  edit(payload_){
    this.navCtrl.push('ClientsAddPage', {payload: payload_})

  }

  removeUser(payload_){
    
    let alert = this.uiUtils.showConfirm(this.dataText.warning, this.dataText.areYouVerySure)  
    alert.then((result) => {

      if(result){
        this.removeUserContinue(payload_)
      }    
    })       
  }

  removeUserContinue(payload_){  
    
    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present()

    if(!payload_.uid)
      payload_.uid = payload_.key
                     
      this.db.updateUserStatus(payload_.uid, 'Removido')
      .then(() => {

        loading.dismiss()
        this.reload()
      })        
  }


  
  
  clientChanged(event){
    this.reload()

  }
  


}
