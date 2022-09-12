import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DatabaseProvider } from '../../providers/database/database';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataTextProvider } from '../../providers/data-text/data-text'

@IonicPage({})
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
  
})
export class HistoryPage {

  private worksSubscription: Subscription;  

  works: Observable<any>;
  worksArray: any = []
  reportsArray: any = []
  usersWorkersArray: any = []
  clientsWorkersArray: any = []
  usersWorkers: any = []  
  client: any
  worker: any
  selectedDate: string
  selectedDateEnd: string  
    
  totalJobs: number = 0
  totalMoney: number = 0
  totalMoneyStr: string
  
  totalComission: number = 0  
  totalComissionStr: string  

  totalFinal: number = 0
  totalFinalStr: string  
  
  isReportOpen: Boolean = false
  textHeader: string = "Relatórios"
  
  code: string = "" 
  workKey: string

  matchesArray = []
  championships = []
  championshipsLeagues = []



  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public dataInfo: DataInfoProvider,    
    public db: DatabaseProvider,
    public platform: Platform,
    private iab: InAppBrowser,
    public dataText: DataTextProvider,
    public navParams: NavParams) {


      this.selectedDateEnd = moment().endOf('day').format() 
      this.selectedDate = moment().startOf('month').format() 
       

      if (document.URL.indexOf("?") > 0) {

        let splitURL = document.URL.split("?");        
        this.workKey = splitURL[1]

        if(this.workKey)
          this.directView()  
        
      }

      
  }

  ionViewDidLoad() {    
    if(this.dataInfo.isHome)
      this.startInterface()
    else
      this.navCtrl.setRoot('LoginPage')
  }
    
  ngOnDestroy() {
   if(this.worksSubscription)
    this.worksSubscription.unsubscribe()
  }  

  directView(){
    this.dataInfo.isHome = true
    this.dataInfo.appUserType = 1                  
    this.code = this.workKey.replace("id=", "")
    this.selectedDate = moment().format() 
    this.codeChanged()
  }

  startInterface(){

    if(this.dataInfo.userInfo.userType !== 3){

      this.isReportOpen = false

      this.selectedDateEnd = moment().endOf('day').format() 
      this.selectedDate = moment().startOf('month').format() 
    
      this.getMatches()
      
      this.usersWorkers = []      

      if(this.dataInfo.userInfo)
        this.getClients()
    }

    
    if(this.navParams.get('code')){
      this.code = this.navParams.get('code')
      this.codeChanged()
    }
  
  }


  getClients(){
    
    this.db.getClients()
    .subscribe(data => {
        this.getClientsCallback(data)
    })
  }

  getClientsCallback(data){

    this.clientsWorkersArray = []
    

    data.forEach(element => {

      let info = element.payload.val()
      info.key = element.payload.key
      
      if(info.status !== 'Desativado'){

        if(this.dataInfo.userInfo.userType === 1)
          this.clientsWorkersArray.push(info)                                                     
        

        else if(this.dataInfo.userInfo.uid === info.cambista)
          this.clientsWorkersArray.push(info)                                                             
      }
      
              
    });

  }

  clientChange(event){    

    console.log('modificado: ')
    console.log(event.value.uid)    
  }


  getMatches(){
        
    return new Promise<void>((resolve, reject) =>{

      this.db.getChampionshipsGames()

      .subscribe(data => {
        this.getMatchesCallback(data)

        resolve()
        
      })

    })
    

  }
  
  getMatchesCallback(data){

    this.matchesArray = []
    this.championships = []

    this.client = ""

    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present()     
    
    data.forEach(element => {      

      let info = element.payload.val()    
      info.key = element.payload.key

      this.championships.push(info)   
    });    

    loading.dismiss()

  }  


 

  clear(){    
    this.client = ""
    this.worker = ""   
    this.worksArray= []    
    this.reportsArray = []    

    this.clearMoney()
    
  }

  clearMoney(){

    this.totalMoney = 0
    this.totalComission = 0
  }


  showHistory(){   

    if(moment(this.selectedDate).isAfter(moment(this.selectedDateEnd).endOf('day')), 'days'){
      
      this.isReportOpen = false
      this.textHeader = "Histórico"
      this.getHistory()

    }

    else {
      this.uiUtils.showAlertError("Data final não pode ser anterior a data inicial")
    }
    
  }

  getHistory(){    
            
    let totalm = moment(this.selectedDateEnd).endOf('day').diff(this.selectedDate, 'months')
    
    if(totalm > 0){

      for (let index = 0; index < totalm; index++) {
      
        let tmp = this.selectedDate.replace("-03:00", "")    
        let dateYear = moment(tmp).add(index, 'month').format('YYYY')  
        let dateMonth = moment(tmp).add(index, 'month').format('MM')  
  
        this.workGet(dateMonth, dateYear)          
      }

    } else {

      let tmp = this.selectedDate.replace("-03:00", "")    
      let dateYear = moment(tmp).format('YYYY')  
      let dateMonth = moment(tmp).format('MM')  
    
      this.workGet(dateMonth, dateYear)          

    }
    
  }  

  workGet(month, year){    

    let loading = this.uiUtils.showLoading(this.dataText.loading)
    loading.present()    

    this.clearMoney()

    this.totalJobs = 0
    this.totalFinal = 0
    this.worksArray= []    
    this.reportsArray = []    


    this.works = this.db.getAllWorksAcceptedsDate(year, month)
      
    this.worksSubscription = this.works.subscribe( data => {
      this.worksCallback(data)      
      loading.dismiss()    
    })
  }

    
  worksCallback(data){           

    data.forEach(element => {

      let info = element.payload.val()
      info.key = element.payload.key     
      info.expand = false
      info.datetimeStr = moment(info.datetime).format("DD/MM/YYYY hh:mm:ss")  
      info.betLink = "https://speedbet07.web.app/#/history?id="+info.id

      if(this.dataInfo.userInfo.uid === info.cambista || this.dataInfo.userInfo.userType === 1)
        this.addArray(info)

    });    


    this.organizaFila()

  }


  addArray(info){

    info.isMultiple = Array.isArray(info.match)

    if(!info.isMultiple)
      info.match = [info.match]

  
    info.finalValueStr = Number(info.finalValue).toFixed(2)
    info.betValueStr = Number(info.betValue).toFixed(2)

    this.worksArray.push(info)
    this.totalComission += Number(info.finalValue)
    this.totalJobs++
    this.totalComissionStr = this.totalComission.toFixed(2)

  }

  organizaFila(){    
           
    this.worksArray.sort((a, b) => {

      let date1 = moment(a.datetime, "DD/MM/YYYY hh:mm:ss").format()
      let date2 = moment(b.datetime, "DD/MM/YYYY hh:mm:ss").format()
      
      let isBefore = moment(date1).isBefore(date2)      

      return isBefore ? 1 : -1;
      
    })

  }
 
  
  openDirect(data){  
      
    let options = 'location=no';

    if(data.directLink){

      if(this.dataInfo.isWeb)
        this.iab.create(data.directLink, '_blank', options);    
      else 
        this.iab.create(encodeURI(data.directLink), '_system', options);

    }            
  }  

  get(){
    this.getHistory()
  }

  codeChanged(){

    let loading = this.uiUtils.showLoading(this.dataText.loading)
    loading.present()    

    let tmp = this.selectedDate.replace("-03:00", "")    
    let dateYear = moment(tmp).format('YYYY')  
    let dateMonth = moment(tmp).format('MM')  

    this.clearMoney()

    this.totalJobs = 0
    this.totalFinal = 0
    this.worksArray= []    
    this.reportsArray = []    
  
    this.works = this.db.getAllWorksAcceptedsDate(dateYear, dateMonth)
      
    this.worksSubscription = this.works.subscribe( data => {
      this.codeChangedCallback(data)      
      loading.dismiss()    
    })
  }

  codeChangedCallback(data){

    this.worksArray = []

    data.forEach(element => {

      let info = element.payload.val()
      info.key = element.payload.key     
      info.expand = false
      info.datetimeStr = moment(info.datetime).format("DD/MM/YYYY hh:mm:ss")      
      
       if(info.id && info.id === this.code)
        this.addArray(info)            

    });    


    this.organizaFila()

  }

  changeStatus(work){
  

    let msg  = work.status === "Aguardando confirmação" ? 
          "Deseja modificar o status para <b>CONFIRMADO</b>?" : 
          "Deseja modificar o status para <b>AGUARDANDO CONFIRMAÇÃO</b>?"

    
    let alert = this.uiUtils.showConfirm(this.dataText.atention, msg)  
    alert.then((result) => {

      if(result){              
        work.status === "Aguardando confirmação" ? work.status = 'Confirmado' : work.status = 'Aguardando confirmação'  

        this.db.updateBetStatus(work.key, work.status)
        .then(() => {

          this.uiUtils.showAlertSuccess("Status modificado com sucesso!")
        })

      }                    
    })
    
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.get()

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


}
