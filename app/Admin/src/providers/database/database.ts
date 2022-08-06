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

    let status = "Perfil não verificado"   
          
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


  /** CONFIGURAÇÕES */
 
  addSettings(stopped, bet,delay, delay_start, delay_end, move_down_bet, move_right_bet ){
    let uid = this.authProvider.currentUserUid()    
    let path = "/configs/" 
    return this.db.list(path).update(uid, {api_hash: '0e6ac8c3f24c20a7f9bb7b5d6150bf68', api_id: '7948726', stopped: stopped, bet: bet, delay: delay, delay_start: delay_start,delay_end: delay_end, move_down_bet: move_down_bet, move_right_bet: move_right_bet } )   
  }


  updateSettings(key_: string, stopped, bet,delay, delay_start, delay_end, move_down_bet, move_right_bet){  
    
    let uid = this.authProvider.currentUserUid()    
    let path = "/configs/"         
    return this.db.list(path).update(uid, {api_hash: '0e6ac8c3f24c20a7f9bb7b5d6150bf68', api_id: '7948726', stopped: stopped, bet: bet, delay: delay, delay_start: delay_start,delay_end: delay_end, move_down_bet: move_down_bet, move_right_bet: move_right_bet } )   

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