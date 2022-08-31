import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DataTextProvider } from '../../providers/data-text/data-text'
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {

  services: Observable<any>;  
  championships: any = []
  championshipsGames: any = []


  
  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public platform: Platform,
    public dataInfo: DataInfoProvider,
    public dataText: DataTextProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    private iab: InAppBrowser,
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
        
    this.services = this.db.getChampionships()

    this.services.subscribe(data => {
      this.getCallback(data)
    })
  }

  getCallback(data){

    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present() 
    
    data.forEach(element => {      

      let info = element.payload.val()    
      this.championships.push(info)        
    });

    loading.dismiss()

    this.getMatches()

  }


  getMatches(){


    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present() 

    this.db.getChampionshipsGames()
    .subscribe(data => {


      this.getMatchesCallback(data)
      loading.dismiss()


    })
  }

  getMatchesCallback(data){
    
    data.forEach(element => {      

      let info = element.payload.val()       
      this.championshipsGames.push(info)        

    });

    this.championships.forEach(element => {

      let name = element.name
      element.matches = []

      this.championshipsGames.forEach(element1 => {        
        

        if(!element1.timer_now)
          element1.timer_now = "00:00"        

        if(element1.championship === name){
          element.matches.push(element1)
        }
        
      });
      
    });

  
  }

 
  goBack(){
    this.navCtrl.pop()
  }

  expand(work){
    work.msgShow = !work.msgShow

  }


  goPageBets(work){
    console.log(work)
    this.navCtrl.push('BetsPage', {payload: work})
  }
  
  open(service){

    let url = service.link
    
    let options = 'location=no';

    if(this.dataInfo.isWeb)
      this.iab.create(url, '_blank', options);    
    else 
      this.iab.create(encodeURI(url), '_system', options);
  }



}
