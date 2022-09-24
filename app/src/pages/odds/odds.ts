import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, Events } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DataTextProvider } from '../../providers/data-text/data-text'
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-odds',
  templateUrl: 'odds.html',
})
export class OddsPage {
  services: Observable<any>;  
  championships: any = []
  championshipsLeagues: any = []
  payload: any 

  finalValue: number = 0
  betValue: number = 0
  client: string = ""

  allowMultiples = false 
  
  constructor(

    public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public platform: Platform,
    public dataInfo: DataInfoProvider,
    public dataText: DataTextProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    public db: DatabaseProvider,
    public events: Events,
    public navParams: NavParams) {
  }


  ionViewDidLoad() {
    
    if(this.dataInfo.isHome)
      this.startInterface()
    else
      this.navCtrl.setRoot('LoginPage') 
  }

  startInterface(){

    this.payload = this.navParams.get('payload')
    this.betValue = this.navParams.get('betValue')
    this.finalValue = this.navParams.get('finalValue')
    this.allowMultiples = this.navParams.get('allowMultiples')

    console.log(this.payload)
  
    if(this.payload && Array.isArray(this.payload.all_odds))
        this.parse()
        
  }

  parse(){
    this.payload.all_odds.forEach(element => {
      this.organize(element)    
      
    });
  }


  organize(element){

    element.market_name = element[0].market_name    

    if(element.market_name === 'Vencedor do Encontro')
      this.checkPreBets(element)
        
  }


  checkPreBets(element){

    element.forEach(element1 => {

      element1.active = false
      
      if(this.payload.odd_casa_ativo  === 1 && element1.name === "Casa")
        element1.active = true

      if(this.payload.odd_empate_ativo  === 1  && element1.name === "Empate")
        element1.active = true

      if(this.payload.odd_fora_ativo  === 1  && element1.name === "Fora")
        element1.active = true
      
    });        

  }


 
  goBack(){

    this.events.publish('update-odds', this.payload)
    this.events.publish('update-finalvalue', this.finalValue)
    this.events.publish('update-betsvalue', this.betValue)
    this.navCtrl.pop()
  }



  clear(){

    this.payload.all_odds.forEach(element => {
      
      element.forEach(element1 => {

          element1.active = false  

      });
      
    });
  }



  addBet(work){

    let tmp = !work.active    
    this.payload.all_odds.forEach(element => {
      
      element.forEach(element1 => {

        if(this.allowMultiples){

          if(element1.market_name === work.market_name)
            element1.active = false  

        }
        else                  
          element1.active = false  


      });
      
    });
    
    work.active = tmp

    this.refreshValues()

  }




  refreshValues(){

    this.finalValue = 0

    this.payload.all_odds.forEach(element => {

        element.forEach(element1 => {
          
          if(element1.active){
                  
            let oddd = element1.odd.replace(',', '.')
            this.finalValue += this.finalValue + Number(oddd)

          }
                  
        });
              
      
    });

    this.finalValue = this.finalValue * this.betValue
    this.finalValue = Number(this.finalValue.toFixed(2))


  }


  apostaChanged(){
    this.refreshValues()
  }


  finish(){

    this.goBack()
    this.events.publish('finish-odds')
    
  }



 





}
