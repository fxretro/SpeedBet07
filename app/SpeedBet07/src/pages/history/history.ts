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

@IonicPage()
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
  
  totalPrePaid: number = 0  
  totalPrePaidStr: string

  totalCard: number = 0  
  totalCardStr: string

  totalComission: number = 0  
  totalComissionStr: string  

  totalFinal: number = 0
  totalFinalStr: string  
  
  isReportOpen: Boolean = false
  textHeader: string = "Relatórios"
  
  status: string = "" 
  code: string = "" 

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public dataInfo: DataInfoProvider,    
    public db: DatabaseProvider,
    public platform: Platform,
    private iab: InAppBrowser,
    public dataText: DataTextProvider,
    public navParams: NavParams) {
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

  startInterface(){
    this.isReportOpen = false
    this.status = "Finalizado"

    // this.status = "Cancelado"
    let statustmp = this.navParams.get('status')

    if(statustmp)
      this.status = statustmp    
    
    this.selectedDateEnd = moment().format() 
    this.selectedDate = moment().startOf('month').format() 
    
    this.usersWorkers = []    
    this.getClients()
  
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

        if(this.dataInfo.userInfo.userType === 1){
          this.clientsWorkersArray.push(info)                                                     
        }

        else if(this.dataInfo.userInfo.uid === info.cambista){
          this.clientsWorkersArray.push(info)                                                     
        }


      }
      
              
    });

  }

  clientChange(event){    

    console.log('modificado: ')
    console.log(event.value.uid)    
  }

  clear(){    
    this.client = ""
    this.worker = ""
    this.status = "Todos"
   
    this.worksArray= []    
    this.reportsArray = []    

    this.clearMoney()
    
  }

  clearMoney(){


    this.totalMoney = 0
    this.totalComission = 0
  }

  showReport(){
    this.isReportOpen = true
    this.textHeader = "Relatórios"
    this.showReports()
  }


  showHistory(){   

    if(moment(this.selectedDate).isAfter(moment(this.selectedDateEnd)), 'days'){
      
      this.isReportOpen = false
      this.textHeader = "Histórico"
      this.getHistory()

    }

    else {
      this.uiUtils.showAlertError("Data final não pode ser anterior a data inicial")
    }
    
  }

  getHistory(){


    this.clearMoney()

    this.totalJobs = 0
    this.totalFinal = 0
    this.worksArray= []    
    this.reportsArray = []    
  
            
    let totalm = moment(this.selectedDateEnd).diff(this.selectedDate, 'months')
    
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


      if(this.dataInfo.userInfo.userType !== 3){


        if(this.dataInfo.userInfo.uid === info.uid ||
          this.dataInfo.userInfo.userType ||          
          info.uid === info.cambista){


          this.addArray(info)

        }


        
      }
        
                  

    });    


    this.organizaFila()

  }


  addArray(info){

    console.log(info)

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

    console.log(this.worksArray)


  }

  organizaFilaRelatorios(){    

    this.reportsArray.sort((a, b) => {

      let date1 = moment(a.datetime).format()
      let date2 = moment(b.datetime).format()
      
      let isBefore = moment(date1).isBefore(date2)      

      return isBefore ? 1 : -1;
      
    })
  }




  
  downloadExcel(){
    let alert = this.uiUtils.showConfirm(this.dataText.warning, "Deseja realizar o download via excel?")  
    alert.then((result) => {

      if(result){
        this.downloadExcelContinue()      
      }        
    })       
  }

  
  downloadExcelContinue(){

    let loading = this.uiUtils.showLoading(this.dataText.loading)
    loading.present()    


    this.db.addReport(this.selectedDate, 
          this.selectedDateEnd, 
          this.worksArray, 
          this.totalJobs, 
          this.totalComissionStr, 
          this.totalPrePaidStr, 
          this.totalCardStr, 
          this.totalMoneyStr, 
          this.totalFinalStr)


    .then(() => {

      loading.dismiss()
      this.uiUtils.showAlertSuccess("Favor aguarde. Estamos processando seu relatório")
      this.showReports()
    })
  }

  showReports(){

    let loading = this.uiUtils.showLoading(this.dataText.loading)
    loading.present()
    
    this.db.getReports()
    .subscribe((data => {

      this.showReportsContinue(data)
      loading.dismiss()

    }))
  }


  showReportsContinue(data){

    this.reportsArray = []
    this.worksArray = []

    data.forEach(element => {

      let info = element.payload.val()
      info.data = moment(info.data).format("MM/YYYY")
      info.dataEnd = moment(info.dataEnd).format("DD/MM/YYYY")            
      info.datetimeStart = moment(info.datetimeStart).format("DD/MM/YYYY")
      info.datetimeEnd = moment(info.datetimeEnd).format("DD/MM/YYYY")
      
      this.reportsArray.push(info)
    });

    this.organizaFilaRelatorios()
    
  }
  
  expand(work){
    work.expand = !work.expand    
  }  

  open(data){        
    this.iab.create(data.url);
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



}
