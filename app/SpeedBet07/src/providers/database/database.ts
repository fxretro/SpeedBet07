import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import * as moment from 'moment';

@Injectable()
export class DatabaseProvider {
      
  db: any
  services: AngularFireList<any>;

  dateYear: string = ""
  dateMonth: string = ""

  constructor(afDatabase: AngularFireDatabase, 
    public dataInfo: DataInfoProvider,
    public authProvider: AuthProvider) {      
    
    this.db = afDatabase    
    this.dateYear = moment().format('YYYY')  
    this.dateMonth = moment().format('MM')      
  }  


  addServices(name){
    let path = "/services/"  
    return this.db.list(path).push({name: name} )
  }

  getServices(){    
    return  this.db.list('/services/').snapshotChanges()       
  }

  /** CONFIGURAÇÃO USUÁRIO */

  saveToken(currentToken: string){    
    if (!currentToken) return;     

    let uid = this.authProvider.currentUserUid()       
    let path = "/userProfile/"  + this.dataInfo.defaultState    

    return this.db.list(path)
        .update(uid, {token: currentToken} )
  }  


  addUserStart(email_: string, type_: number, name_: string, state_: string){  

    let uid = this.authProvider.currentUser().uid   
    let path = "/userProfile/" + state_

    let status = "Perfil verificado"   
          
    let credits = 9999
            
    return this.db.list(path)

        .update(uid, {

            email: email_, 
            userType: type_, 
            name: name_, 
            ranking: 'Bronze',
            totalWorks: 0, 
            totalIndications: 0, 
            cpf: '',
            state: state_, 
            country: 'Brasil', 
            city: '', 
            street: '', 
            district: '', 
            postCode: '',
            number: '', 
            status: status, 
            message: "Seja bem vindo", 
            maxGames: 20000,
            credits: credits,            
            isPremium: 0,
            isPrePaid: 0
          })
  }

  updateUser(
    uid_: string, 
    razaoSocial_: string,
    nome_: string,
    sobrenome_: string,
    endereco_: string, 
    complemento_: string, 
    numero_: string, 
    cep_: string, 
    district_: string, 
    telefone_: string, 
    foto_: string,      
    tipo_: number, 
    description_: string, 
    bank_:string, 
    agency_: string, 
    account_: string, 
    cpf_: string,
    cnpj_: string,        
    state_: string,
    city_: string,      
    pix: string){

      let path = "/userProfile/" + this.dataInfo.defaultState
    
      return this.db.list(path)

      .update(uid_, {
        razaoSocial: razaoSocial_, 
        name: nome_, 
        lastName: sobrenome_, 
        address: endereco_, 
        uid: uid_,
        complement: complemento_, 
        numero: numero_,
        postCode: cep_,
        district: district_,
        userType: tipo_, 
        tel: telefone_, 
        description: description_,
        cpf: cpf_,
        cnpj: cnpj_,
        bank: bank_,
        agency: agency_,
        url: foto_,
        account: account_,        
        state: state_,
        city: city_,                
        pix: pix
      })                
  }

  updateUserStatus(uid_, status_){
    return this.db.list("/userProfile/" + this.dataInfo.defaultState).update(uid_, { status: status_ })
  }

 

  getUser(){
    let uid = this.authProvider.currentUserUid()          
    let path = "/userProfile/"  + this.dataInfo.defaultState + "/"    
        

    return this.db.list(path, 
          ref => ref.orderByKey()
            .equalTo(uid))
            .snapshotChanges()            
  }

  /** CONFIGURAÇÕES DO SISTEMA */
  
  getAllSettings(){    
        
    let path = "/configs/"    

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()            
  }


  /** JOGOS E CAMPEONATOS */


  getChampionships(){

    let path = "/championships/"

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()             
  }

  getChampionshipsGames(){

    let path = "/championship_matches/"

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()             
  }

  /** CLIENTES */


  getClients(){    
    let path = "/clients/"  + this.dataInfo.defaultState + "/"

    return this.db.list(path)
            .snapshotChanges()            
  }    

  addClient(email_: string, type_: number, name_: string, state_: string){  

    let uid = this.authProvider.currentUser().uid   
    let path = "/clients/" + state_

    let status = "Perfil verificado"   
          
    let credits = 9999
    
    return this.db.list(path)

        .update(uid, {

            email: email_, 
            userType: type_, 
            name: name_, 
            ranking: 'Bronze',
            totalWorks: 0, 
            totalIndications: 0, 
            cpf: '',
            state: state_, 
            country: 'Brasil', 
            city: '', 
            street: '', 
            district: '', 
            postCode: '',
            number: '', 
            status: status, 
            message: "Seja bem vindo", 
            maxGames: 20000,
            credits: credits,            
            isPremium: 0,
            isPrePaid: 0,
            cambista: this.dataInfo.userInfo.uid
          })
  }

  updateClient(
    uid_: string, 
    email_: string,
    razaoSocial_: string,
    nome_: string,
    sobrenome_: string,
    endereco_: string, 
    complemento_: string, 
    numero_: string, 
    cep_: string, 
    district_: string, 
    telefone_: string, 
    foto_: string,      
    tipo_: number, 
    description_: string, 
    bank_:string, 
    agency_: string, 
    account_: string, 
    cpf_: string,
    cnpj_: string,        
    state_: string,
    city_: string,      
    pix: string){

      let path = "/clients/" + this.dataInfo.defaultState
    
      return this.db.list(path)

      .update(uid_, {
        razaoSocial: razaoSocial_, 
        email: email_,
        name: nome_, 
        lastName: sobrenome_, 
        address: endereco_, 
        uid: uid_,
        complement: complemento_, 
        numero: numero_,
        postCode: cep_,
        district: district_,
        userType: tipo_, 
        tel: telefone_, 
        description: description_,
        cpf: cpf_,
        cnpj: cnpj_,
        bank: bank_,
        agency: agency_,
        url: foto_,
        account: account_,        
        state: state_,
        city: city_,                
        pix: pix
      })                
  }



    /****************
   * APOSTAS
   **********************/

  addBet(data){


    let dateYear = moment().format('YYYY')  
    let dateMonth = moment().format('MM')     
    let path = "/betsDone/"  + this.dataInfo.defaultState + "/" +  dateYear + "/" + dateMonth

    return this.db.list(path).push(data)
  }

  getAllWorksAcceptedsDate(year, month){  
    
    let path = '/betsDone/'+ this.dataInfo.defaultState + "/" +  year + "/" + month
    console.log(path)

    return this.db.list(path, 
      ref => ref.orderByKey())
      .snapshotChanges()     
  } 


    /****************
   * REPORTS
   **********************/

     addReport(data_, dataEnd_, array, totalJobs, totalComissionStr, totalPrePaidStr, totalCardStr, totalMoneyStr, totalFinalStr){ 

      let path = this.dataInfo.defaultState + "/" +  this.dateYear + "/" + this.dateMonth
      let ref = this.db.list('/reportsAdmin/'+ path)
      let dateToday = moment().format('DD/MM/YYYY HH:mm:ss')
  
      return ref.push({
        uid: this.authProvider.currentUserUid(), 
        data: data_, 
        dataEnd: dataEnd_,   
        state: this.dataInfo.defaultState,   
        statusReport: 'Processando',      
        datetime: dateToday,
        array: array,
        totalJobs: totalJobs,
        totalComissionStr: totalComissionStr,
        totalPrePaidStr: totalPrePaidStr,
        totalCardStr: totalCardStr,
        totalMoneyStr: totalMoneyStr,
        totalFinalStr: totalFinalStr
      })
    }
  
    getReports(){    
  
      let path = this.dataInfo.defaultState + "/" +  this.dateYear + "/" + this.dateMonth
      console.log(path)
  
      let uid = this.authProvider.currentUserUid()
  
      return this.db.list("/reportsAdmin/" + path, 
        ref => ref.orderByChild('uid')
        .startAt(uid)
        .endAt(uid + "\uf8ff"))
        .snapshotChanges()        
    }
  

  
}