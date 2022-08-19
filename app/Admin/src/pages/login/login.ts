import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';
import firebase from 'firebase/app';
import 'firebase/auth';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataTextProvider } from '../../providers/data-text/data-text'

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  userConfig:any;
  autoLogin: Boolean = true
  username: string
  password: string
  languageSelected: number = 0

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public uiUtils: UiUtilsProvider,
    public authProvider: AuthProvider,
    public storage: Storage,
    public navParams: NavParams,
    private iab: InAppBrowser,
    public dataText: DataTextProvider,
    public db: DatabaseProvider) {
    
      this.startInterface() 

  }

  ionViewDidLoad() {
    var self = this  
    
    this.autoLogin = this.navParams.get("autoLogin")

    //this.username = "admin@dbltecnologia.com.br"        
    //this.password = "123456"    


    this.dataInfo.isHome = false


    if(this.autoLogin == undefined)
      this.autoLogin = true      

    if(this.autoLogin){      

      firebase.auth().onAuthStateChanged(function(user) {      

        if(user)
          self.goHome()
      });                  
    }

    

    // this.loginDev()
        
  }  

  loginDev(){          
    
    this.username = "admin@dbltecnologia.com.br"        
    this.password = "123456"    
    this.loginUser()    
  }
  
  
  goHome(){    

    
    this.userConfig = this.db.getUser().subscribe(data => {  
      
      
      this.goPageHomeUserContinue(data)            
        this.userConfig.unsubscribe()
    })

    this.getConfigurations() 


  }

  goPageHomeUserContinue(data){  

    data.forEach(element => {               
      this.dataInfo.userInfo = element.payload.val()
      this.dataInfo.userType = element.payload.val().userType
      
      
    });




    
      
    this.getConfigurations() 
    
  }

  getConfigurations(){
    
    let sub = this.db.getAllSettings()  
    .subscribe(data => {


      this.getCallback(sub, data)
      
    })
  }

  getCallback(sub, data){

    data.forEach(element => {      

      let uid = this.authProvider.currentUserUid()    
      

      if(uid === element.uid){

          this.dataInfo.configs = element

          
          console.log(this.dataInfo.configs)
      }
    })
  

    sub.unsubscribe()

    this.dataInfo.isHome= false
    this.goPageHome()   

  }


  goPageHome(){     

    if(this.dataInfo.userInfo.status === "Perfil verificado"){

      if(! this.dataInfo.isHome){

        this.dataInfo.isHome= true
        this.navCtrl.setRoot(HomePage);   
  
      }
            
      else 
        this.uiUtils.showAlertError("Usuário não localizado ou senha incorreta")                       

    }
    
    else 
        this.uiUtils.showAlertError("Acesso negado, favor entrar em contato com o suporte")                       
    


  }  


  
  goPageDev(){
            
    setTimeout(() => {  
                         
      // this.navCtrl.setRoot('RegionsPage');

    }, 1000);
  }

  startInterface(){    
    
    this.storage.get('default-state')

    .then((data) => {
            
      // if(data)
        // this.dataInfo.defaultState = data      

    })

    
  
  }  

  loginUser(): void {        

    if (! this.username || this.username.length < 6){
      this.uiUtils.showAlert(this.dataText.warning, this.dataInfo.titleUsernameMinLenght).present()

    } else if (! this.password || this.password.length < 6){
      this.uiUtils.showAlert(this.dataText.warning, this.dataInfo.titlePasswordMinLenght).present()
      
    } else {
      this.loginContinue(this.username.trim(), this.password.trim())
    }
  }

  loginContinue(email, pass){
    
    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present() 
    var self = this

    this.authProvider.loginUser(email, pass)

    .then( () => {

      loading.dismiss();
      self.goHome()

    }, error => {

      console.log(error)


      loading.dismiss().then( () => {
        self.uiUtils.showAlert(this.dataText.warning, this.dataInfo.titleAuthError).present()
      });
    });    
  }

  

  selectedStateChanged(){

  }

  
  languageChanged(){

    this.languageSelected === 0 ?  this.languageSelected = 1 : this.languageSelected = 0
    this.dataText.languageSelected = this.languageSelected

    this.storage.set('language', this.dataText.languageSelected)
    .then(() => {        
               
      if(this.dataText.languageSelected === 1){
        // this.dataInfo.defaultState = "DF"
        this.dataText.translateEnglish()
      }
      else 
        this.dataText.translatePortuguese()
      
                
    })
   


  }

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }
  
  goToResetPassword(): void {
    
    if (this.username.length > 0){
      this.authProvider.resetPassword(this.username).then( () => {
        this.uiUtils.showAlert(this.dataText.warning, "Verifique seu e-mail").present()

      }, error => {
          this.uiUtils.showAlert(this.dataText.warning, "Erro ao tentar recuperar senha").present()
      });  

    } else 
        this.uiUtils.showAlert(this.dataText.warning, "Erro ao tentar recuperar senha").present()    
  }    
   
    goTerms(){
      
      let url = this.dataInfo.appTermsConditions
      let options = 'location=no';

      if(this.dataInfo.isWeb)
        this.iab.create(url, '_blank', options);    
      else 
        this.iab.create(encodeURI(url), '_system', options);
    }


    goPriv(){

      let url = this.dataInfo.appTermsPriv
      let options = 'location=no';

      if(this.dataInfo.isWeb)
        this.iab.create(url, '_blank', options);    
      else 
        this.iab.create(encodeURI(url), '_system', options);

    }
    

 

}
