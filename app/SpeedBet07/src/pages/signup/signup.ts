import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { Storage } from '@ionic/storage';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DatabaseProvider } from '../../providers/database/database';
import { DataTextProvider } from '../../providers/data-text/data-text'
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  page:any;
  params:any={};
  data: any=[];  
  userTypeName: string;
  
   @ViewChild('signupSlider') signupSlider: any;
   @ViewChild('fullnameInput') fullnameInput;
   @ViewChild('emailInput') emailInput;
   @ViewChild('telInput') telInput;
   @ViewChild('passwordInput') passwordInput;
   @ViewChild('password1Input') password1Input;


 	public fullname: string = "";
  public tel: string = "";
 	public email: string = "";
  public password: string = "";
   
  constructor(public navCtrl: NavController, 
    public authProvider: AuthProvider,
    public storage: Storage,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public events: Events,
    public dataInfo: DataInfoProvider,
    public uiUtils: UiUtilsProvider,
    private iab: InAppBrowser,
    public dataText: DataTextProvider) {    
      
      this.data=  {
        txtHead:"Criar nova conta",
        btnSignUp:this.dataText.register,
        btnForgotPassword:"Esqueceu a senha",
        txtFullName:"Nome",
        txtAddress:this.dataText.address,
        txtEmail:"E-mail",
        txtPassword:'Password',
        imgLogo:'assets/imgs/logo.jpeg',
        txtTel: "Telefone"
     }     

  }


  ionViewDidLoad() {    
    this.uiUtils.showAlert("Bem vindo", "Favor informar seus dados").present()
  

    setTimeout(() => {

      if(this.fullnameInput)
        this.fullnameInput.setFocus();  
    
    }, 3000);
    
  }

  fullnameInputChanged(){

    if(this.telInput)
      this.telInput.setFocus();  
  } 

  telInputChanged(){

    if(this.emailInput)
      this.emailInput.setFocus();  

  }

  emailInputChanged(){

    if(this.passwordInput)
      this.passwordInput.setFocus();  
  }

  passwordInputChanged(){

    if(this.password1Input)
      this.password1Input.setFocus();  
  }

  password1InputChanged(){
    
  }

  
  signupUser(){           

    let alert = this.uiUtils.showConfirm("Atenção", "Ao cadastrar você aceita os termos de uso e privacidade.") 

    alert.then((result) => {

      if(result){              

        this.storage.set('ion_did_tutorial', false).then(res => {
          this.signupContinue()
        });   

      }
              

    }) 
  }

  signupContinue(){
    
    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)    
    loading.present()     

    
    this.authProvider.signupUser(this.email, this.password,  this.tel)
    .then( ()  => {

      loading.dismiss().then( () => {          
          this.signupUserFinish()
        });          

    }, (error) => {

      loading.dismiss().then( () => {
          this.treatError(error)
      });
      
      
    });
  }

  treatError(error){
    
    if(error.code === 'auth/email-already-in-use')
      this.uiUtils.showAlert(this.dataText.warning, "Já registrado").present()    
    
    else 
      this.uiUtils.showAlert(this.dataText.warning, error).present()            
    
  }
  
  
  signupUserFinish(){    
    let loading = this.uiUtils.showLoading("Criando perfil")    
    loading.present() 


    let self = this

    this.db.addUserStart(this.email, 1, this.fullname, this.dataInfo.defaultState).then( () => {   
      
      if(loading)
          loading.dismiss()

      self.dataInfo.userName = self.fullname   
      self.dataInfo.userInfo = {name: self.fullname, userType:1, tel: this.tel}
      self.dataInfo.primeiroUso = true


      
      self.events.publish('signedup')
      self.navCtrl.setRoot('LoginPage')
      self.uiUtils.showAlert(this.dataText.success, "Seja bem vindo").present()    

      
      
    })    
  }
  
  goBack(){
    this.navCtrl.pop()
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
