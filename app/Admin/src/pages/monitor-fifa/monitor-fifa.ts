import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DataTextProvider } from '../../providers/data-text/data-text'
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-monitor-fifa',
  templateUrl: 'monitor-fifa.html',
})
export class MonitorFifaPage {

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
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
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
        
    this.services = this.db.getMonitorsFifa()

    this.services.subscribe(data => {
      this.getCallback(data)
    })
  }

  getCallback(data){
    
    data.forEach(element => {      

      let info = element.payload.val()            

      if(info.uid === this.dataInfo.userInfo.uid){

        info.msgShow = false
        info.key = element.payload.key
        info.datetimeStr = moment(info.datetime).format("DD/MM/YYYY hh:mm:ss")
        this.snkrs.push(info)
      }
              
    });

    this.snkrs.sort(function(a,b){      

      let d = moment(a.datetime, "DD/MM/YYYY hh:mm:ss").isBefore(moment(b.datetime, "DD/MM/YYYY hh:mm:ss"));
      return d
    });


    this.snkrs = this.snkrs.reverse()

    console.log('Nova array')
    console.log(this.snkrs)

    
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
    
    this.stopped == 0 ? this.stopped = 1 : this.stopped = 0  

    this.db.changeStatusRobot(this.stopped)    
    .then( () => {
      this.uiUtils.showAlert(this.dataText.success, this.dataText.removeSuccess)
    })

  }

  expand(work){
    work.msgShow = !work.msgShow

  }


  changeBet(work){

    console.log(work)

    let alert = this.alertCtrl.create({
      title: "Novo valor do investimento",
      inputs: [
        {
          name: 'question',
          placeholder: "Novo valor do investimento"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          handler: data => {
            console.log('Cancelado')
          }
        },
        {
          text: "Modificar",
          handler: data => {

            console.log('Novo valor ', data.question)
            this.uiUtils.showAlertSuccess("Em desenvolvimento")


          }
        }
      ]
    });
    alert.present();
      
  }

  anular(service){

    console.log(service)

    let alert = this.uiUtils.showConfirm(this.dataText.warning, this.dataText.areYouSure)
    alert.then((result) => {

      if(result){
        this.anularContinue(service)                 
      }    
    })   

  }

  anularContinue(data){
    

    console.log('Anulando ', data.key)

    this.db.updateMonitorsFifa(data.key, 'Anulado')    
    .then( () => {

      this.uiUtils.showAlert(this.dataText.success, "Anulado com sucesso")


    })

   
  }



}
