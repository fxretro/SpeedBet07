import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, Events } from 'ionic-angular';
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
  championships: any = []
  championshipsLeagues: any = []
  matchesArray: any = []
  allOddsArray: any = []

  finalValue: number = 0
  betValue: number = 0
  client: string = ""
  allowMultiples: Boolean  = false // TODO: Permitir fazer apostas multiplas

  
  constructor(

    public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public platform: Platform,
    public dataInfo: DataInfoProvider,
    public dataText: DataTextProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    public events: Events,
    public db: DatabaseProvider,
    public navParams: NavParams) {

      this.events.subscribe('update-odds', (data) => {        
        this.updateBets(data)
      })

      this.events.subscribe('finish-odds', () => {        
        this.finish()
      })
      

      this.events.subscribe('update-finalvalue', (data) => {        
        this.finalValue = Number(data)
      })

      this.events.subscribe('update-betsvalue', (data) => {        
        this.betValue = Number(data)
      })
      
      
  }


  ionViewDidLoad() {
    
    if(this.dataInfo.isHome)
      this.startInterface()
    else
      this.navCtrl.setRoot('LoginPage') 
  }

  ngOnDestroy(){

    this.events.unsubscribe('update-odds')
    this.events.unsubscribe('finish-odds')
    this.events.unsubscribe('update-finalvalue')
    this.events.unsubscribe('update-betsvalue')
  }

  startInterface(){

    this.get()
  }


  get(){
        
    return new Promise<void>((resolve, reject) =>{

      this.services = this.db.getChampionshipsGames()

      this.services.subscribe(data => {
        this.getCallback(data)

        resolve()
        
      })

    })
    
  }
  
  getCallback(data){

    this.matchesArray = []
    this.championships = []
    this.championshipsLeagues = []

    this.client = ""


    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present()     
    
    data.forEach(element => {      

      let info = element.payload.val()    
      info.key = element.payload.key

      let tmp = []        

      info.matches.forEach(element => {

        let matchDate = moment(element.data, "DD/M")
        let matchTime = moment(element.hora, "H:mm")
        
        if(moment().isBefore(matchTime, 'hour')){

          element.data = matchDate.format("DD/MM")
          element.championship = info.championship
          element.odd_casa_ativo = 0
          element.odd_empate_ativo = 0
          element.odd_fora_ativo = 0
          element.key = info.key
          element.allOddsArray = []
  
          this.matchesArray.push({name: element.time_a})
          this.matchesArray.push({name: element.time_b})

          tmp.push(element)

        }       
        
      });

      if(tmp.length > 0){

        
        info.matches = tmp
        this.championships.push(info)    

      }                  

    });    

    loading.dismiss()

  }  

  clear(){

    this.championships.forEach(info => {      
      
      info.matches.forEach(element => {

        element.odd_casa_ativo = 0
        element.odd_empate_ativo = 0
        element.odd_fora_ativo = 0
        element.allOddsArray = []
        
      });

    });

    this.finalValue = 0
    this.betValue = 0

  }
 
  goBack(){
    this.navCtrl.pop()
  }

  addBet(work, type){

    this.clearAllOdds(work)

    this.unmark(work, type) 
    this.refreshValues()   
    
  }


  unmark(work, type){

    if(type === 1){
      work.odd_empate_ativo = 0
      work.odd_fora_ativo = 0
      work.odd_casa_ativo === 0 ? work.odd_casa_ativo = 1 : work.odd_casa_ativo =0
    }
          
    if(type === 2){
      work.odd_casa_ativo = 0
      work.odd_fora_ativo = 0
      work.odd_empate_ativo === 0 ? work.odd_empate_ativo = 1 : work.odd_empate_ativo =0  
    }

    if(type === 3){
      work.odd_empate_ativo = 0
      work.odd_casa_ativo = 0
      work.odd_fora_ativo === 0 ? work.odd_fora_ativo = 1 : work.odd_fora_ativo =0  
    }
  }


  refreshValues(){

    this.finalValue = 0

    this.championships.forEach(element => {

      element.matches.forEach(element1 => {

        let odd_a = element1.odd_casa.replace(',', '.')
        let odd_b = element1.odd_empate.replace(',', '.')
        let odd_c = element1.odd_fora.replace(',', '.')

        if(element1.odd_casa_ativo === 1){
          this.finalValue += this.finalValue + Number(odd_a)
        }

        if(element1.odd_empate_ativo === 1){
          this.finalValue += this.finalValue + Number(odd_b)
        }

        if(element1.odd_fora_ativo === 1){
          this.finalValue += this.finalValue + Number(odd_c)
        } 
        
        this.refreshAllOdds(element1)

        
      });

      
      
    });

    this.finalValue = this.finalValue * this.betValue
    this.finalValue = Number(this.finalValue.toFixed(2))


  }


  remove(odd, match){
    
    odd.active = false
    this.updateBets(match)
    this.refreshValues()

  }

  clearAllOdds(work){


    this.championships.forEach(element => {

      element.matches.forEach(element1 => {        

        if(element1.time_a === work.time_a){


          if(element1.allOddsArray){
            element1.allOddsArray = []
          }
  
          if(element1.all_odds){
  
            element1.all_odds.forEach(element2 => {
  
              element2.forEach(element3 => {
                
                element3.active = false  
  
              });
  
              
              
            });
  
          }
          
        }
        
        

        
      });
      

    });
                
    
  }

  refreshAllOdds(element){

    if(element.all_odds && Array.isArray(element.all_odds)){

      element.all_odds.forEach(element1 => {

        if(element1.active){
          this.finalValue += this.finalValue + Number(element1.odd)
        }
        
      });
      
      
    }
    
  }


  goPageOdds(work){    
    this.navCtrl.push('OddsPage', {payload: work, betValue: this.betValue, finalValue: this.finalValue, allowMultiples: this.allowMultiples})
  }
  
 
  matchChanged(event){

    this.get()
    .then(() => {

      if(event.value && event.value.name.length > 0)
        this.matchChangedContinue(event)

    })        
            
  }


  matchChangedContinue(event){

    let tmp = []
    let tmp1 = []

    this.championships.forEach(element => {

      element.matches.forEach(element1 => {        

        if(! tmp.includes(element1)){

          if(element1.time_a && element1.time_a === event.value.name){      

            element.matches = []
            element.matches.push(element1)

            tmp1.push(element)
            tmp.push(element1)
  
          }                          
  
          else if(element1.time_b && element1.time_b === event.value.name){

            element.matches = []
            element.matches.push(element1)

            tmp1.push(element)
            tmp.push(element1)

          }
  
        }
        
      });
           
    });


    this.championships = tmp1
  }

  

  finish(){


    this.championshipsLeagues = []

    this.championships.forEach(element => {

      element.matches.forEach(element1 => {

        element1.key = element.key

        if(element1.odd_casa_ativo === 1)
          this.championshipsLeagues.push(element1)
        

        if(element1.odd_empate_ativo === 1)
          this.championshipsLeagues.push(element1)
        

        if(element1.odd_fora_ativo === 1)
          this.championshipsLeagues.push(element1)


        if(element1.odd_casa_ativo === 0 && 
            element1.odd_empate_ativo === 0 && 
            element1.odd_fora_ativo === 0 && 
            element1.all_odds && Array.isArray(element1.all_odds)){

          element1.all_odds.forEach(element2 => {

            element2.forEach(element3 => {

              if(element3.active){

                let merged = Object.assign(element1, element3);
                this.championshipsLeagues.push(merged)



              }
              
            });
            
          });


        }
                
      });      
      
    });

    this.navCtrl.push('BetsPage', {
        payload: this.championshipsLeagues, 
        isMultiple: true, 
        finalValue: this.finalValue,
        betValue: this.betValue  
      })
  }

  apostaChanged(){
    this.refreshValues()
  }

  goPageHistory(){
    this.navCtrl.push('HistoryPage')
  }


  doRefresh(refresher) {
    this.get()

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
 
  updateBets(payload){
  
    this.championships.forEach(info => {      
      
      info.matches.forEach(element => {

        if(element.time_a === payload.time_a)
          this.replaceOdds(element, payload)          
                
        
      });

    });


  }


  replaceOdds(element, payload){

    element.allOddsArray = []
    element.odd_casa_ativo = 0
    element.odd_empate_ativo = 0
    element.odd_fora_ativo = 0

    payload.all_odds.forEach(element1 => {

      element1.forEach(element2 => {        

        if(element2.active){    
      

          if(element2.market_name === "Vencedor do Encontro"){


            if(element2.name === "Casa"){
  
              element.odd_casa_ativo = 1
              element.odd_empate_ativo = 0
              element.odd_fora_ativo = 0
            }
              
    
            if(element2.name === "Empate"){
    
              element.odd_casa_ativo = 0
              element.odd_empate_ativo = 1
              element.odd_fora_ativo = 0
            }
              
    
            if(element2.name === "Fora"){
    
              element.odd_casa_ativo = 0
              element.odd_empate_ativo = 0
              element.odd_fora_ativo = 1
            }
  
          }

          else {

            element.allOddsArray.push(element2)
    
          }
          
        } 
               
        
      });
              
      
    });


  }


}
