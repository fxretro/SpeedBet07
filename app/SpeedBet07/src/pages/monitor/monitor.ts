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
  matchesArray: any = []

  
  constructor(

    public navCtrl: NavController, 
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
        
    this.services = this.db.getChampionshipsGames()

    this.services.subscribe(data => {
      this.getCallback(data)
    })
  }
  
  getCallback(data){

    this.matchesArray = []
    this.championships = []
    this.championshipsGames = []


    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present() 
    
    data.forEach(element => {      

      let info = element.payload.val()          
      this.championships.push(info)        

      
      this.matchesArray.push({name: info.team_a})
      this.matchesArray.push({name: info.team_b})

    });

    loading.dismiss()

  }  
 
  goBack(){
    this.navCtrl.pop()
  }

  goPageBets(work, type){

    work.type = type
    this.navCtrl.push('BetsPage', {payload: work})
  }
  
 
  matchChanged(event){

    console.log('Procurando jogo  ',event.value.name)
    
    let tmp = []

    this.championships.forEach(element => {

      if(! tmp.includes(element)){

        if(element.team_a && element.team_a === event.value.name){              
          element.push(element)

          tmp.push(element)

        }                          

        else if(element.team_b && element.team_b === event.value.name){
          element.push(element)
          tmp.push(element)
        }

      }
      
    });


    this.championships = tmp
    
  }



}
