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
    
  code: string = ""

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


  addServices(){

    this.db.addServices("Casa")
    this.db.addServices("Empate")
    this.db.addServices("Fora")
  }

  logout(){
    this.events.publish('logout')
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.dataInfo.eventFcmStart);
  }

  startInterface(){    
    this.events.publish(this.dataInfo.eventFcmStart, 1);   
  }
 
  
  goHistoryPage(){        
    this.navCtrl.push('HistoryPage')
  }

  
  goPageOportunities(){    
    this.navCtrl.push('MonitorPage')
  }

  goPageRegister(){
    this.navCtrl.push('RegisterPage')
  }

  goPageClients(){
    this.navCtrl.push('ClientsPage')
  }

  goPagePix(){
    
    let url = "https://nubank.com.br/pagar/1mp8ai/zyKDNSbr9O"
    let options = 'location=no';

    if(this.dataInfo.isWeb)
      this.iab.create(url, '_blank', options);    
    else 
      this.iab.create(encodeURI(url), '_system', options);      
  }

  codeChanged(){    

    if(this.code.length === 6)
      this.navCtrl.push('HistoryPage', {code: this.code})

  }

  
}

