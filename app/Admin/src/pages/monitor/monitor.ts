import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DataTextProvider } from '../../providers/data-text/data-text'
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {

  services: Observable<any>;  
  snkrs: any = []

  stopped = 0
  bet = 5
  delay = 1
  
  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public platform: Platform,
    public dataInfo: DataInfoProvider,
    public dataText: DataTextProvider,
    public db: DatabaseProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
    if(this.dataInfo.isHome)
      this.startInterface()
    else
      this.navCtrl.setRoot('LoginPage') 
  }

  startInterface(){

    this.stopped = 0
    this.bet = 5
    this.delay = 1
    

    this.getConfig()
    this.get()
  }

  getConfig(){
    
    this.db.getAllSettings()

    .subscribe((payload) => {

      if(payload)
        this.configContinue(payload)    

    })
   

  }


  configContinue(payload){

    this.stopped = 0
    this.bet = 5
    this.delay = 1
   

    payload.forEach(element => {

      let payload = element.payload.val()
      payload.key = element.payload.key
      
      this.stopped = payload.stopped
      this.bet = payload.bet
      this.delay = payload.delay
  
      console.log('Configuração carregada com sucesso')
      
    });



  }

  get(){
        
    this.services = this.db.getMonitors()

    this.services.subscribe(data => {
      this.getCallback(data)
    })
  }

  getCallback(data){
    
    data.forEach(element => {
      console.log(element.payload.val())


      let info = element.payload.val()
      info.datetimeStr = moment(info.datetime).format("DD/MM/YYYY hh:mm:ss")

      this.snkrs.push(info)
    });
  }

  add(){
    this.navCtrl.push('MonitorUrlAddPage')
  }

  edit(service){    
    let info = service.payload.val()
    info.key = service.payload.key    

    console.log(info)
  } 
  
  goBack(){
    this.navCtrl.pop()
  }



  remove(data){

    let self  = this

    let alert = this.uiUtils.showConfirm(this.dataText.warning, this.dataText.areYouSure)
    alert.then((result) => {

      if(result){
        this.removeContinue(data)                 
      }    
    })   
  }

  removeContinue(data){


    this.db.removeMonitors(data.key)    
    .then( () => {
      this.uiUtils.showAlert(this.dataText.success, this.dataText.removeSuccess)
    })
  }

  changeStatusRobot(){

    console.log('Mudando status ', this.stopped)
    this.stopped == 0 ? this.stopped = 1 : this.stopped = 0
    console.log('Status modificado', this.stopped)

    this.db.changeStatusRobot(this.stopped)    
    .then( () => {


      this.uiUtils.showAlert(this.dataText.success, this.dataText.removeSuccess)
    })

  }



}
