import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, Platform, NavParams, MenuController, Events } from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera'
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { StorageProvider } from '../../providers/storage/storage';
import 'rxjs/add/operator/debounceTime';

import { FormControl } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { DataTextProvider } from '../../providers/data-text/data-text'

import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',    
})

export class RegisterPage  implements OnInit {

  @ViewChild('nameInput') nameInput;
  @ViewChild('lastNameInput') lastNameInput;
  @ViewChild('addressInput') addressInput;
  @ViewChild('complementInput') complementInput;
  @ViewChild('telInput') telInput;
  @ViewChild('cpfInput') cpfInput;
  @ViewChild('plateInput') plateInput;
  @ViewChild('agencyInput') agencyInput;
  @ViewChild('accountInput') accountInput;  
  @ViewChild('prefixoInput') prefixoInput;      
  @ViewChild('pixInput') pixInput;      


  public formGroup: FormGroup;     
  base64Image: string = '';
  selectedPhoto: any;  
  selectedBank: string = '';
  agency: string = '';
  account: string = '';
  complement: string = '';  
  pix: string = '';
  uid_: string = ''
  description: string = '';
  cnpj: string = "";
  razaoSocial: string = ""
  prefixo: string  
  brand: string    
  clientInfo: any = []
  primeiroUso: Boolean = false;
  photoChanged: Boolean = false  
  searchControl: FormControl;
  searching: any = false;
  selectedService: string = "Entrega"
  plate: string = ""
  services: any = [];  
  carBrands: Observable<any>;
  carBrandsArray: any = []
  carModelArray: any = []
  cepChanged: Boolean = false
  clientType: string = "Pessoa jurídica"
  totalDistance: string = "2000"
  

  constructor(
    public navCtrl: NavController, 
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public uiUtils: UiUtilsProvider,    
    public storage: StorageProvider, 
    public storageNative: Storage,
    public camera: CameraProvider,    
    public navParams: NavParams,
    
    public events: Events,
    public menu: MenuController,
    public db: DatabaseProvider,    
    public alertCtrl: AlertController, 
    private formBuilder: FormBuilder,
    
    public dataInfo: DataInfoProvider,
    public dataText: DataTextProvider) {
    
      this.clear()      
  }

  ngOnInit() {
    this.initForm()    
    
  }
  
  ionViewDidLoad() {    
    this.loadInterface()                
  }
  
  loadInterface(){    
    this.primeiroUso = this.dataInfo.primeiroUso

    
    //this.primeiroUso =  true
        
    if(this.primeiroUso)      
      this.firstUse()
    else
      this.loadInfo() 
  }

  firstUse(){    
    
    this.menu.enable(false);

    let tel = this.navParams.get("tel")              
        
    this.formGroup.patchValue({
      name: this.dataInfo.userName,   
      tel: tel,  
      complement: this.dataText.textUninformed           
    })
    
    this.uiUtils.showAlert(this.dataText.warning, this.dataText.textCheckYourInformationAndSave).present()
    .then(() => {

      if(this.dataInfo.appUserType === 1)
        this.checkClientType()
    })


  }

  checkClientType() {
  
    let myAlert = this.alertCtrl.create({
      title: this.dataText.textSelectYourClientType,
      enableBackdropDismiss: true ,
      message:this.dataText.textSelectYourClientType2,
      buttons:[{
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
      
        this.clientType = data
        
        if(this.clientType === this.dataText.textClientType2)
          this.checkLastName()
        else 
          this.checkClientTypeJur()                
    },

    role: ''
  }
  ],
  inputs:[
  {
      type: 'radio',
      id: 'opt1',
      name: this.dataText.textClientType2,
      label: this.dataText.textClientType2,
      value: this.dataText.textClientType2,
      checked: true
  },
  {
      type: 'radio',
      id: 'opt2',
      name: this.dataText.textClientType1,
      label: this.dataText.textClientType1,
      value: this.dataText.textClientType1,
      checked: false
  }
  ]
  });
  myAlert.present();
    
  }


  checkClientTypeJur(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textInformYourCompanyName,
      enableBackdropDismiss: true ,
      message:this.dataText.textSelectYourClientType2,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
      
        this.razaoSocial = data.name
        this.checkClientCNPJ()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.textCompanyName
    }
  ]
  });
  myAlert.present();
    

  }

  checkClientCNPJ(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textYourCompanyIdentification,
      enableBackdropDismiss: true ,
      message:this.dataText.textYourCompanyIdentification2,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
      
        this.cnpj = data.name
        this.checkLastName()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.textCompanyIdName
    }
  ]
  });
  myAlert.present();
    

  }

  checkName(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textWhatIsYourName,
      enableBackdropDismiss: true ,
      message:this.dataText.textTellUsYourName,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
            
        this.formGroup.patchValue({
          name: data.name
        })

        this.checkLastName()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.titleName
    }
  ]
  });
  myAlert.present();
    
  }


  checkLastName(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textWhatIsYourLastName,
      enableBackdropDismiss: true ,
      message:this.dataText.textTellUsYourLastName,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
            
        this.formGroup.patchValue({
          lastName: data.name
        })        

        this.checkCEP()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.titleName
    }
  ]
  });
  myAlert.present();
    
  }


  checkPhone(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textWhatIsYourPhoneNumber,
      enableBackdropDismiss: true ,
      message:this.dataText.textTellUsYourPhoneNumber,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
            
        this.formGroup.patchValue({          
          tel: data.name
        })

        this.checkCEP()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.titleName
    }
  ]
  });
  myAlert.present();
    
  }


  checkCEP(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textWhatIsYourPostCode,
      enableBackdropDismiss: true ,
      message:this.dataText.textTellUsYourPostCode,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {    
                  
        this.formGroup.patchValue({
          postCode: data.name
        })
        
        this.checkNumber()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.titleName
    }
  ]
  });
  myAlert.present();
    
  }


  checkNumber(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textWhatIsYourNumber,
      enableBackdropDismiss: true ,
      message:this.dataText.textTellUsYourNumber,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
            
        this.formGroup.patchValue({
          numero: data.name
        })

        this.checkCPF()
            
    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.titleName
    }
  ]
  });
  myAlert.present();
    
  }


  checkCPF(){

    let myAlert = this.alertCtrl.create({
      title: this.dataText.textWhatIsYourIdentification,
      enableBackdropDismiss: true ,
      message:this.dataText.textTellUsYourIdentification,
      buttons:[
  {
      text: this.dataText.titleCancel,
      handler: data => {
          console.log('Abbrechen clicked. Data -> ' + JSON.stringify(data));
          },
      role: 'cancel'
  },
  {
    text: 'OK',
    handler: data => {            
            
        this.formGroup.patchValue({
          cpf: data.name
        })
        
        this.cepInputChanged()

    },
    role: ''
  }
  ],
  inputs:[
  {
      type: 'text',
      id: 'opt1',
      name: 'name',
      label: this.dataText.titleName
    }
  ]
  });
  myAlert.present();
    
  }

  
  nameInputChanged(){

    if(this.lastNameInput)
      this.lastNameInput.setFocus();
  }

  lastNameInputChanged(){
    if(this.addressInput)
      this.addressInput.setFocus();
  }

  addressInputChanged(){
    if(this.complementInput)
    this.complementInput.setFocus();
  }

  complementInputChanged(){
    if(this.telInput)
      this.telInput.setFocus();
  }

  stateChanged(){
    
  }

  cepInputChanged(){    

    if(! this.cepChanged){      
      this.cepChanged = true
      this.cepCheck()
    }
    
  }

  cepCheck(){

    
  }

  geocodeAddressCallback(result){

    if(result && result[0]){

      if(result[0].formatted_address){

        this.formGroup.patchValue({      
          address: result[0].formatted_address          
        })
      }


      if(result[0].address_components[1] && result[0].address_components[1].short_name){

        this.formGroup.patchValue({              
          district: result[0].address_components[1].short_name,        
        })

      }

      result[0].address_components.forEach(element => {

        if(element && element.types && element.short_name){          

          element.types.forEach(element1 => {            

            if(element1 === 'administrative_area_level_1'){

              this.formGroup.patchValue({              
                state: element.short_name,        
              })
              
            }

            if(element1 === 'administrative_area_level_2'){

              this.formGroup.patchValue({              
                city: element.short_name,        
              })
              
            }
            
          });

        }
        
      });
    
      if(this.primeiroUso)
        this.checkPhotoWizard()

    } 
    else {
      this.uiUtils.showToast(this.dataText.textPostCodeError)
    }    
  }

  checkPhotoWizard(){

    setTimeout(() => {

      this.cepChanged = false

      this.uiUtils.showAlertSuccess(this.dataText.textUploadPhoto)
      .then(() => {
        this.selectPicture()
      })
      
      
    }, 3000);

    
  }

  numeroInputChanged(){

  }

  districtChanged(){

  }

  cityChanged(){

  }

  telInputChanged(){
    if(this.cpfInput)
      this.cpfInput.setFocus();
  }

  cpfnputChanged(){

    if(this.dataInfo.userInfo.userType === 1)
      this.uiUtils.showAlertSuccess(this.dataText.textCheckInfoAndSave)

    else {

      if(this.prefixoInput)    
        this.prefixoInput.setFocus();

    }
  }

  prefixoInputChanged(){
    if(this.plateInput)    
        this.plateInput.setFocus();
  }

  plateInputChanged(){
    if(this.agencyInput)
      this.agencyInput.setFocus();
  }

  agencyInputChanged(){
    if(this.accountInput)
      this.accountInput.setFocus();
  }

  accountInputChanged(){

    if(this.pixInput)
      this.pixInput.setFocus();
  }

  pixInputChanged(){
    this.uiUtils.showAlertSuccess(this.dataText.textCheckInfoAndSave)
  }

  cnpjChanged(){      
 
  }

  initForm() {    
        
    this.formGroup = this.formBuilder.group({   
      name: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      lastName: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      address: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      complement: ['',[Validators.nullValidator, Validators.minLength(3), Validators.maxLength(300)]],      
      postCode: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      numero: ['',[Validators.required, Validators.minLength(0), Validators.maxLength(4)]],      
      district: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(300)]],      
      state: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(20)]],      
      city: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      cpf: ['',[Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      tel:  ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    });
  }
  
  
  
  loadInfo(){ 
        
    if(this.dataInfo.isHome)
      this.startInterface()    
    else
      this.navCtrl.setRoot('LoginPage')

  }  

  startInterface(){

    this.menu.enable(true);
    this.clear()
    this.loginInfoUser()   

  }

  loginInfoUser(){
    
    let payload = this.dataInfo.userInfo    

    this.formGroup.patchValue({
      name: payload.name,
      lastName: payload.lastName,
      address: payload.address,
      cpf: payload.cpf,
      tel: payload.tel,
      city: payload.city,
      state: payload.state,
      district: payload.district,
      numero: payload.numero,
      postCode: payload.postCode,
      complement: payload.complement
    })

    this.razaoSocial = payload.razaoSocial    
    this.description = payload.description
    this.base64Image = payload.url
    
    this.agency = payload.agency
    this.selectedBank = payload.bank
    this.account = payload.account
    this.selectedService = payload.carName
    this.plate = payload.carPlate 
    this.cnpj = payload.cnpj     
    this.totalDistance = payload.totalDistance
    this.pix = payload.pix 
    this.clientType = payload.clientType

    setTimeout(() => {

      this.brand = payload.brand
      this.prefixo = payload.prefixo                        

    }, 5000);
    
  }

  


  save(){

    if(!this.formGroup.value.name || this.formGroup.value.name.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError12)
    }

    else if(!this.formGroup.value.lastName || this.formGroup.value.lastName.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError13)      
    }

    else  if(!this.formGroup.value.address || this.formGroup.value.address.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError14)      
    }

    else  if(!this.formGroup.value.numero || this.formGroup.value.numero.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError15)      
    }

    else if(!this.formGroup.value.postCode || this.formGroup.value.postCode.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError16)      
    }

    else if(!this.formGroup.value.address || this.formGroup.value.address.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError14)      
    }

    else if(!this.formGroup.value.district || this.formGroup.value.district.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError17)      
    }

    else if(!this.formGroup.value.tel || this.formGroup.value.tel.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError18)      
    }

    else if(!this.formGroup.value.cpf || this.formGroup.value.cpf.length === 0){
      this.uiUtils.showAlertError(this.dataText.textRegisterError19)      
    }

    else {
      this.saveCheckContinue()            
    }
  }

  saveCheckContinue(){

    let alert = this.uiUtils.showConfirm(this.dataText.atention, this.dataText.areYouSure)  
    alert.then((result) => {

      if(result){              
        this.update()    
      }                    
    })
  }

  finish(){
    var self = this

    let alert = this.uiUtils.showConfirm(this.dataText.atention, this.dataText.areYouSure)  
    alert.then((result) => {

      if(result)  
        self.update()    
    })    
  }

  clear(){
    this.complement = ""       
    this.selectedBank = "" 
    this.agency = "" 
    this.account = ""     
    this.cnpj = ""     
    this.plate = ""
    this.prefixo = ""
    this.prefixo = ""
    this.selectedService = ""
    this.description = ""
    this.razaoSocial = ""
    this.uid_ = ''
    this.photoChanged = false
    this.totalDistance = "2000"
  }

 
  update(){

    if(this.base64Image){

      if(this.photoChanged)
        this.uploadWithPic()
      else 
        this.uploadFinish(this.base64Image) 
    }
      
    else 
      this.uploadFinish("")   
  }

  uploadWithPic(){    
    let loading = this.uiUtils.showLoading(this.dataText.uploading)
    loading.present()

    let datanow = moment().format("YYYYDDMMhhmmss")
    let path = "/pictures/" + datanow + '/'    

    this.storage.uploadPicture(this.base64Image)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          
          if(loading)
            loading.dismiss()

          this.events.publish('userInfo:updatePhoto', url)
          this.uploadFinish(url)           

        }).catch(err => {
      
          if(loading)
            loading.dismiss()

          this.uiUtils.showAlert(this.dataText.warning, err).present()
          
        })
      })
      .catch( error => {
        
        if(loading)
          loading.dismiss()
        this.uiUtils.showAlert(this.dataText.warning, error).present()
      })        
  }



  uploadFinish(url: string){
    
    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)
    loading.present()

    let self = this    

    this.defaultValues() 
          
    this.db.updateUser(
      this.dataInfo.userInfo.uid,
      this.razaoSocial,
      this.formGroup.value.name, 
      this.formGroup.value.lastName, 
      this.formGroup.value.address, 
      this.formGroup.value.complement,
      this.formGroup.value.numero,
      this.formGroup.value.postCode,
      this.formGroup.value.district,
      this.formGroup.value.tel, 
      url,       
      this.dataInfo.userInfo.userType, 
      this.description, 
      this.selectedBank,
      this.agency,
      this.account,
      this.formGroup.value.cpf,
      this.cnpj,                  
      this.formGroup.value.state,
      this.formGroup.value.city,            
      this.pix)

  .then( () =>{
    
      if(loading)
        loading.dismiss()

      self.uiUtils.showAlertSuccess(this.dataText.textSuccess1)
      .then( () => {
        self.saveContinue()      
      })      
    })
    .catch( () => {      
      this.uiUtils.showAlertError(this.dataText.textRegisterError20)
    })
  }

  documents(){
    this.navCtrl.push("DocumentationPage")
  }

  defaultValues(){

    if(!this.formGroup.value.state || this.formGroup.value.state.length === 0)
      this.formGroup.value.state = ""
    
    if(!this.formGroup.value.city || this.formGroup.value.city.length === 0)
      this.formGroup.value.city = ""    

    if(!this.description)
      this.description = this.dataText.titleCompleteDescription    

    if(!this.formGroup.value.complement)
        this.formGroup.value.complement = ""

    if(! this.selectedService  || this.selectedService.length === 0)
      this.selectedService = this.dataText.textUninformed

    if(! this.plate  || this.plate.length === 0)
      this.plate = this.dataText.textUninformed

    if(! this.cnpj || this.cnpj.length === 0)
      this.cnpj = this.dataText.textUninformed   
      
    if(! this.pix || this.pix.length === 0)
      this.pix = this.dataText.textUninformed   
      
    if(! this.clientType || this.clientType.length === 0)
      this.clientType = this.dataText.textClientType2
      
    if(! this.selectedBank  || this.selectedBank.length === 0)
      this.selectedBank = this.dataText.textUninformed   

    if(! this.agency  || this.agency.length === 0)
      this.agency = this.dataText.textUninformed   

    if(! this.account  || this.account.length === 0)
      this.account = this.dataText.textUninformed            

    if(! this.prefixo  || this.prefixo.length === 0)
      this.prefixo = this.dataText.textUninformed         

    if(! this.brand  || this.brand.length === 0)
      this.brand = this.dataText.textUninformed  

    if(! this.razaoSocial  || this.razaoSocial.length === 0)
      this.razaoSocial = this.dataText.textUninformed  

    if(!this.totalDistance)
      this.totalDistance = ""

    if(!this.dataInfo.userInfo.latitude){
      this.dataInfo.userInfo.latitude = ""
      this.dataInfo.userInfo.longitude = ""
    }
    
  }

  saveContinue(){

    let sub = this.db.getUser().subscribe(data => {   
      this.saveCallback(sub, data)
    })              

  }


  saveCallback(sub, data){

    sub.unsubscribe()

    data.forEach(element => {              
      this.dataInfo.userInfo = element.payload.val()         
    });              
    
    if(this.primeiroUso){    
      
      this.primeiroUso = false  
      this.dataInfo.primeiroUso = false

      this.navCtrl.setRoot('LoginPage', { autoLogin: true, primeiro: false })      
      this.menu.enable(true);       

    }
    
  }

  selectPicture(){
    this.openMenu()
  }

  openFilePhoto(event){
      this.base64Image = event.srcElement.files[0];
  }

  picChange(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image = event.target.result;
        this.photoChanged = true
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }

  grabPicture() {
 
    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)      
    loading.present();

    this.camera.grabPicture().then((imageData) => {
            
      this.selectedPhoto  = this.dataInfo.dataURItoBlob('data:image/jpeg;base64,' + imageData);                  
      this.base64Image = 'data:image/jpeg;base64,' + imageData
      this.photoChanged = true
      
      if(loading)
        loading.dismiss()

    }, (err) => {
      if(loading)
        loading.dismiss()
    });
   }

    onSuccess = (snapshot) => {        
    this.base64Image = snapshot.downloadURL;
  }
  
  onError = (error) => {
   // console.log('error', error);
  }

  accessGallery(){    
     this.camera.getPicture().then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData
      this.photoChanged = true

    }, (err) => {
     //console.log(err);
    });
   }

  delPicture(){
    this.base64Image = ""
  }      

  handlerCamera(){
    if(! this.dataInfo.isWeb)
      this.grabPicture()
    else
      this.uiUtils.showAlert(this.dataText.atention, this.dataText.notAvailable).present()
  }

  handlerGalery(){
    if(! this.dataInfo.isWeb)
      this.accessGallery()
    else
      this.uiUtils.showAlert(this.dataText.atention, this.dataText.notAvailable).present()
    
  }
  
  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: this.dataText.titleChangePic,
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.handlerCamera()
          }
        },
        {
          text: 'Album',
          icon: !this.platform.is('ios') ? 'albums' : null,
          handler: () => {
            this.handlerGalery()
          }
        },       
        {
          text: this.dataText.titleCancel,
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null
        }
      ]
      
    });
    actionSheet.present();
  }    
  
  
  brandChanged(){

    this.carModelArray = []
    this.carBrandsArray.forEach(element => {

      if(element.name === this.brand){

        let res = element.models.split(";");         

        res.forEach(bra => {
          this.carModelArray.push(bra)  
        });
                
      }
      
    });
  }
}
