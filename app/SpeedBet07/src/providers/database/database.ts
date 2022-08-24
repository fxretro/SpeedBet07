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

  /** Odds asiáticas */

  getMonitors(){

    let path = "/betAviso/"

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()             
  }

  removeMonitors(key_: string){
  
    let path = "/betAviso/" 
    return this.db.list(path).remove(key_)
  } 

  updateMonitors(key_: string, status){  
        
    let path = "/betAviso/"         
    return this.db.list(path).update(key_, {status: status } )   

  }   


  /** futebol online */

  getMonitorsFifa(){
    
    let path = "/betAvisoTsv/" 

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()             
  }

  removeMonitorsFifa(key_: string){

    let uid = this.authProvider.currentUserUid()    
    let path = "/betAvisoTsv/" 

    return this.db.list(path).remove(key_)
  } 

  updateMonitorsFifa(key_: string, status){  
        
    let path = "/betAvisoTsv/"         
    return this.db.list(path).update(key_, {status: status } )   

  }   



  /** ooprtunidades */

  getOportunities(){
    
    let path = "/betOportunities/" 

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()             
  }


  /** CONFIGURAÇÕES */
 
  addSettings(stopped, bet,delay, delay_start, delay_end, move_down_bet, move_right_bet, bet_fifa, robo_megabolt, robo_tirosecovirtual, meta_dia, only_save, robo_brunojogado ){
    let uid = this.authProvider.currentUserUid()    
    let path = "/configs/" 

    robo_brunojogado == true ? robo_brunojogado = 1 : robo_brunojogado = 0
    only_save == true ? only_save = 1 : only_save = 0
    robo_megabolt == true ? robo_megabolt = 1 : robo_megabolt = 0
    robo_tirosecovirtual == true ? robo_tirosecovirtual = 1 : robo_tirosecovirtual = 0
    stopped == true ? stopped = 1 : stopped = 0
    bet = Number(bet)
    delay = Number(delay)
    delay_start = Number(delay_start)
    delay_end = Number(delay_end)
    
    

    return this.db.list(path).update(uid, {
          api_hash: '0e6ac8c3f24c20a7f9bb7b5d6150bf68', 
          api_id: '7948726', 
          stopped: stopped, 
          bet: bet, 
          bet_fifa: bet_fifa,
          delay: delay, 
          delay_start: delay_start,
          delay_end: delay_end, 
          move_down_bet: move_down_bet, 
          move_right_bet: move_right_bet,
          robo_megabolt: robo_megabolt,
          robo_tirosecovirtual: robo_tirosecovirtual,
          meta_dia: meta_dia,
          only_save: only_save
         } )   
  }



  updateSettings(key_: string, stopped, bet,delay, delay_start, delay_end, move_down_bet, move_right_bet, bet_fifa, robo_megabolt, robo_tirosecovirtual, meta_dia, only_save, robo_brunojogado){  
    

    robo_brunojogado == true ? robo_brunojogado = 1 : robo_brunojogado = 0
    robo_megabolt == true ? robo_megabolt = 1 : robo_megabolt = 0
    robo_tirosecovirtual == true ? robo_tirosecovirtual = 1 : robo_tirosecovirtual = 0
    stopped == true ? stopped = 1 : stopped = 0
    bet = Number(bet)
    delay = Number(delay)
    delay_start = Number(delay_start)
    delay_end = Number(delay_end)
    only_save == true ? only_save = 1 : only_save = 0
    
    let uid = this.authProvider.currentUserUid()    
    let path = "/configs/"         
    return this.db.list(path).update(uid, {
      api_hash: '0e6ac8c3f24c20a7f9bb7b5d6150bf68', 
      api_id: '7948726', 
      stopped: stopped, 
      bet: bet, 
      bet_fifa: bet_fifa,
      delay: delay, 
      delay_start: delay_start,
      delay_end: delay_end, 
      move_down_bet: move_down_bet, 
      move_right_bet: move_right_bet,      
      robo_megabolt: robo_megabolt,
      robo_tirosecovirtual: robo_tirosecovirtual,
      meta_dia: meta_dia,
      only_save: only_save
     } )   

  }   

  getAllSettings(){    
    
    
    let path = "/configs/"    

    return this.db.list(path, 
        ref => ref.orderByKey())
        .snapshotChanges()            
  }


  changeStatusRobot(stopped){

    let uid = this.authProvider.currentUserUid()          
    let path = "/configs/"
    return this.db.list(path).update(uid, {stopped: stopped } )   
  }



  
}