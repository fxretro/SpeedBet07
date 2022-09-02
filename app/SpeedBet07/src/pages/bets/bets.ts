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

  finalValue: number = 0
  finalValueReceived: number = 0
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


    let odd_a = this.payload.odd_a.replace(',', '.')
    let odd_b = this.payload.odd_b.replace(',', '.')
    let odd_c = this.payload.odd_c.replace(',', '.')

    this.finalValueReceived = 0

    if(this.selectedService && Array.isArray(this.selectedService)){

      this.selectedService.forEach(element => {

        if(element === "Casa")
          this.finalValueReceived += this.finalValue * Number(odd_a)

        if(element === "Empate")
          this.finalValueReceived += this.finalValue * Number(odd_b)

        if(element === "Fora")
          this.finalValueReceived += this.finalValue * Number(odd_c)

        
      });

    }

    else {

      if(this.selectedService === "Casa")
        this.finalValueReceived += this.finalValue * Number(odd_a)

      if(this.selectedService === "Empate")
        this.finalValueReceived += this.finalValue * Number(odd_b)

      if(this.selectedService === "Fora")
        this.finalValueReceived += this.finalValue * Number(odd_c)

    }
    

    this.finalValueReceived = Number(this.finalValueReceived.toFixed(2))    

  }


  clientChanged(){    

    this.usersClientsArray.forEach(element => {

      if(element.name === this.client)
          console.log(element)
      
    });
    
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
        
        this.usersClientsArray.push(info)

      }      
        
      
    });

  }

  



  loadValues(){
    this.payload = this.navParams.get('payload')
    console.log(this.payload)
  }


  clear(){
  
    this.key = ""
    this.finalValue = 0

    
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
  }

   
  
  add(){

    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)    
    loading.present()  
    
    let service = {


      name: this.selectedService, 
      total: this.finalValue, 
      paymentKey: this.dataText.notAvailable, 
      paymentPath: this.dataText.notAvailable, 
      paymentMethod: this.dataText.notAvailable, 
      clientName: this.client,            
      professionalName: this.dataText.notAvailable,
      uid: this.dataInfo.userInfo.uid
    }    

    this.dataInfo.userInfo.carInfo = service    
    let data = {}

    this.storageNative.set('last', data);    
    this.uiUtils.showAlertSuccess(this.dataText.sucess)

    loading.dismiss()

    this.clear()

  }  

 

  enviaQuickRun(){

    this.checkAddress()
    .then(() => {
        this.enviaQuickRunOk()
    })  
    .catch(() => {

      this.uiUtils.showAlertError(this.dataText.errorSent5)
    })
          
  }

  checkAddress(){

    return new Promise<void>(function(resolve, reject){      
      resolve()

    });  
  }

  enviaQuickRunOk(){
    
    this.requestSent = true
    this.enviaQuickRunFinish()
    
  }

  enviaQuickRunFinish(){

    
    let data = {

      match: this.payload, 
      finalValue: this.finalValue,
      finalValueReceived: this.finalValueReceived, 
      service: this.selectedService, 
      cliente: this.client,
      cambista: this.dataInfo.userInfo.uid,
      datetime: moment().format()

    }

    this.enviaQuickRunFim(data)
                      
   }

   enviaQuickRunFim(data){
   

    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)    
    loading.present()

    this.storageNative.set('lastQuick', data);     
    console.log(data)
            
    this.db.addBet(data)

      .then(() => {              

        loading.dismiss()
        this.sendCallback()
                
      })      
      .catch(() => {
        this.uiUtils.showAlertError("Falha ao realizar aposta")      
      })


   }


   sendCallback(){

    this.navCtrl.pop()
    this.uiUtils.showAlertSuccess("Aposta realizada com sucesso")   

    this.requestSent = false
    this.anArray = []    
    
   }

         
  
   recoveryLastQuickRun(){

    this.storageNative.get('lastQuick')

    .then((data)=>{

      if(data)
          this.recoveryLastContinue(data)      
      else 
        this.uiUtils.showAlertError(this.dataText.errorSent4)            
    })
  }   


    recoveryLastContinue(data){
       
    }
   

    goPageReports(){

      this.navCtrl.push('HistoryPage', {payload: this.payload})
    }

   
}
