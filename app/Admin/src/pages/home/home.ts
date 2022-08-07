import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DataTextProvider } from '../../providers/data-text/data-text'
import { DatabaseProvider } from '../../providers/database/database';
import { Subscription } from 'rxjs/Subscription'
import { InAppBrowser } from '@ionic-native/in-app-browser';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  

  private serviceSubscription: Subscription;

  paymentTitle: string = "Aguardando"
  totalRegisterCompleted: string = "100"

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public dataInfo: DataInfoProvider,
    public events: Events,
    public dataText: DataTextProvider,
    private iab: InAppBrowser,    
    public db: DatabaseProvider,
    public navParams: NavParams) {

  }
  

  ionViewDidLoad() {  
    
    if(this.dataInfo.isHome)
      this.startInterface()    
    else
      this.navCtrl.setRoot('LoginPage')  
    
    
    this.subscribeStuff()   
  }

  subscribeStuff(){


    this.events.subscribe(this.dataInfo.eventFcmToken, data => {        
              
      this.dataInfo.setToken(data)
      this.db.saveToken(data)        
  });       
  }

  logout(){
    this.events.publish('logout')
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.dataInfo.eventFcmStart);

    if(this.serviceSubscription)
      this.serviceSubscription.unsubscribe()
  }

  startInterface(){
    this.events.publish(this.dataInfo.eventFcmStart, 1);

    if(this.dataInfo.isDev){
      this.dev()    
    }
  }

  
  dev(){    
    this.navCtrl.push('MonitorUrlPage')
  }


  goPageSettings(){
    this.navCtrl.push('SettingsPage')
  } 


  goPageMonitorOnline(){    
    
    this.navCtrl.push('MonitorCornerPage')
  }

  goPageMonitorFifaOnline(){    
    this.navCtrl.push('MonitorFifaPage')
  }


  goPageOportunities(){
    this.navCtrl.push('MonitorPage')
  }

 
  

  
  
}


