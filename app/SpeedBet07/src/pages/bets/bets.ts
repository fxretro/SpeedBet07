import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DatabaseProvider } from '../../providers/database/database';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { DataTextProvider } from '../../providers/data-text/data-text'


@IonicPage()
@Component({
  selector: 'page-bets',
  templateUrl: 'bets.html',
})
export class BetsPage {

  services: Observable<any>;  
  payload: any
  key: string = ""
  
  selectedService: any  
  client: any  

  betValue: number = 0
  finalValue: number = 0
  comission: number = 0
  servicesArray: any = []

  public anArray:any=[];

  usersClients: Observable<any>;
  usersClientsArray: any = []
  
  usersWorkers: Observable<any>;
  usersWorkersArray: any = []
  requestSent: Boolean = false

  public anArrayRun:any=[];

  acceptedsArray: any = []
  isMultiple: Boolean  = false

  constructor(
    public navCtrl: NavController,
    public httpd: HttpdProvider, 
    public uiUtils: UiUtilsProvider,    
    public zone: NgZone,    
    public dataInfo: DataInfoProvider,    
    public db: DatabaseProvider,    
    public storageNative: Storage,
    public modalCtrl: ModalController,    
    public dataText: DataTextProvider,  
    public navParams: NavParams) {
  }
  
  ionViewDidLoad() {

    if(this.dataInfo.isHome)
      this.startInterface()    
    else
      this.navCtrl.setRoot('LoginPage')  
  }

  ngOnDestroy(){
    
  }

  startInterface(){    

    this.clear()  
    this.getServices()
    this.loadValues()  
    this.getClients()                            
    this.acceptedsArray = []    
  }


  apostaChanged(){
    


    let odd_a = this.payload.odd_casa.replace(',', '.')
    let odd_b = this.payload.odd_empate.replace(',', '.')
    let odd_c = this.payload.odd_fora.replace(',', '.')

    this.finalValue = 0

    if(this.selectedService && Array.isArray(this.selectedService)){

      this.selectedService.forEach(element => {

        if(element === "Casa")
          this.finalValue += this.betValue * Number(odd_a)

        if(element === "Empate")
          this.finalValue += this.betValue * Number(odd_b)

        if(element === "Fora")
          this.finalValue += this.betValue * Number(odd_c)

        
      });

    }

    else {

      if(this.selectedService === "Casa")
        this.finalValue += this.betValue * Number(odd_a)

      if(this.selectedService === "Empate")
        this.finalValue += this.betValue * Number(odd_b)

      if(this.selectedService === "Fora")
        this.finalValue += this.betValue * Number(odd_c)

    }
    
    

    this.finalValue = Number(this.finalValue.toFixed(2))    

  }


  clientChanged(){    
    
  }
     

  getClients(){
    this.getClientsContinue()
  }

  getClientsContinue(){

    this.db.getClients()
    .subscribe(data => {
        this.getClientsCallback(data)
    })
  }


  getClientsCallback(data){

    this.usersClientsArray = []

    data.forEach(element => {

      let info = element.payload.val()
      info.key = element.payload.key

      if(info.status !== 'Desativado'){

        if(this.dataInfo.userInfo.userType === 1){
          this.usersClientsArray.push(info)                                                     
        }        

        else if(this.dataInfo.userInfo.uid === info.cambista){
          this.usersClientsArray.push(info)                                                     
        }

      }
       
      
    });

  }

  
  loadValues(){

    this.isMultiple = this.navParams.get('isMultiple') 
    this.payload = this.navParams.get('payload')
    this.finalValue = this.navParams.get('finalValue')
    this.betValue = this.navParams.get('betValue')

    console.log(this.payload)
    
  }


  clear(){
  
    this.key = ""
    this.finalValue = 0
    this.betValue = 0
    
  }

  getServices(){
    
    this.services = this.db.getServices()

    this.services.subscribe(data => {
      this.getServicesCallback(data)
    })
  }

  getServicesCallback(data){

    this.servicesArray = []
    
    data.forEach(element => {

      let info = element.payload.val()
      info.key = element.payload.key              

      this.servicesArray.push(info)
    });

    this.loadOddSelected()
  }

  loadOddSelected(){


    if(this.payload && this.payload.type){

      if(this.payload.type === 1)
        this.selectedService = "Casa"
      
      if(this.payload.type === 2)
        this.selectedService = "Empate"
      
      if(this.payload.type === 3)
        this.selectedService = "Fora"
      

    }
  }
   


  enviaQuickRun(){
    
    this.requestSent = true
    this.enviaQuickRunFinish()
    
  }

  enviaQuickRunFinish(){

    if(this.dataInfo.userInfo.userType !== 3 && !this.client)
      this.uiUtils.showAlertError("Favor selecionar o cliente")

    else if(!this.isMultiple && !this.selectedService)
      this.uiUtils.showAlertError("Favor informar a aposta")

    else if(this.dataInfo.userInfo.userType !== 3 && !this.finalValue)
      this.uiUtils.showAlertError("Favor informar o valor da aposta")

    else {

      if(this.dataInfo.userInfo.userType === 3 && !this.client)
        this.client = "Avulso"

      if(!this.selectedService)  
        this.selectedService = "Multipla"
      

      let data = {

        match: this.payload, 
        finalValue: this.finalValue,
        service: this.selectedService, 
        cliente: this.client,
        cambista: this.dataInfo.userInfo.uid,
        cambistaNome: this.dataInfo.userInfo.name,
        datetime: moment().format(),
        status: this.dataInfo.userInfo.userType === 3 ? "Aguardando confirmação" : "Confirmado",
        id: this.makeid(6),
        betValue: this.betValue

      }

      this.enviaQuickRunFim(data)

    }

   }

  

   enviaQuickRunFim(data){

    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)    
    loading.present()
            
    this.db.addBet(data)

      .then(() => {              

        loading.dismiss()
        this.sendCallback(data)
                
      })      
      .catch((error) => {

        this.uiUtils.showAlertError("Falha ao realizar aposta")      
      })


   }


   sendCallback(data){

    this.navCtrl.pop()
    this.uiUtils.showAlert("Aposta realizada com sucesso", "Identificador <h1 style=\" text-align: center;\">" + data.id + "</h1>")   .present()
    this.requestSent = false
    this.anArray = []    
    
   }


    goPageReports(){
      this.navCtrl.push('HistoryPage', {payload: this.payload})
    }

    makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }


   
}
