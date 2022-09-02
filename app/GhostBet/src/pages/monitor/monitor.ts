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
    this.get()
  }  

  get(){
        
    this.services = this.db.getMonitorsFifa()

    const sub = this.services.subscribe(data => {

      this.getCallback(data)
      sub.unsubscribe()
    })
  }

  getCallback(data){

    this.snkrs = []
    
    data.forEach(element => {      

      let info = element.payload.val()           

      if(moment(info.datetime, "DD/MM/YYYY hh:mm:ss").isSame(moment(), 'day')){
        

        info.msgShow = true
        info.key = element.payload.key
        info.datetimeStr = moment(info.datetime).format("DD/MM/YYYY hh:mm:ss")

        console.log(info)
        
        this.snkrs.push(info)

      }
                    
    });

    this.snkrs.sort(function(a,b){      
      let d = moment(a.datetime, "DD/MM/YYYY hh:mm:ss").isBefore(moment(b.datetime, "DD/MM/YYYY hh:mm:ss"));
      return d
    });


    this.snkrs = this.snkrs.reverse()
    
  }

  
  goBack(){
    this.navCtrl.pop()
  }

  
  expand(work){
    work.msgShow = !work.msgShow

  }




}
