import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { DatabaseProvider } from '../../providers/database/database';
import { StorageProvider } from '../../providers/storage/storage';
import { CameraProvider } from '../../providers/camera/camera'
import { DataTextProvider } from '../../providers/data-text/data-text'
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  payload: any

  key: string = ""
  stopped: number = 0
  bet: number = 0
  bet_fifa: number = 0
  delay: number = 0
  delay_start: number = 0
  delay_end: number = 0
  move_down_bet: number = 0
  move_right_bet: number = 0
  robo_megabolt: number = 0
  robo_tirosecovirtual: number = 0


  meta_dia=10
  base64Image: string = '';    
  selectedPhoto: any;
  photoChanged: Boolean = false
  

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public platform: Platform,
    public authProvider: AuthProvider,
    public dataInfo: DataInfoProvider,
    public actionsheetCtrl: ActionSheetController,
    public camera: CameraProvider,    
    public storage: StorageProvider, 
    public dataText: DataTextProvider,
    public db: DatabaseProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {

    if(this.dataInfo.isHome)
      this.startInterface()
    else
      this.navCtrl.setRoot('LoginPage')     
  }

  startInterface(){


    this.stopped = 0
    this.bet = 5
    this.bet_fifa = 5
    this.delay = 1
    this.delay_start = 5
    this.delay_end = 5
    this.move_down_bet = 80
    this.move_right_bet = 365
    this.robo_megabolt=1
    this.robo_tirosecovirtual=1
    this.meta_dia = 10

    this.clear()  
    this.getConfig()
  }


  getConfig(){
    
    let sub = this.db.getAllSettings()

    .subscribe((payload) => {

      sub.unsubscribe()


      if(payload)
        this.configContinue(payload)    

    })
   

  }


  configContinue(payload){


    let uid = this.authProvider.currentUserUid()    

    payload.forEach(element => {

      this.payload = element.payload.val()

      if(element.payload.key === uid){


        this.payload.key = element.payload.key
        this.key = this.payload.key
        this.stopped = this.payload.stopped
        this.bet = this.payload.bet
        this.bet_fifa = this.payload.bet_fifa
        this.delay = this.payload.delay
        this.delay_start = this.payload.delay_start
        this.delay_end = this.payload.delay_end
        this.move_down_bet = this.payload.move_down_bet
        this.move_right_bet = this.payload.move_right_bet

        this.robo_tirosecovirtual = this.payload.robo_tirosecovirtual
        this.robo_megabolt = this.payload.robo_megabolt
        
        this.selectPicture = this.payload.url
        this.base64Image = this.payload.url

        this.meta_dia = this.payload.meta_dia


        
        if(!this.move_down_bet)
          this.move_down_bet = 80
        
        if(!this.move_right_bet)
          this.move_right_bet = 365
    
        console.log('Configuração carregada com sucesso')

      }
      
    });



  }

  clear(){
    this.key = ""    
    this.base64Image = ""
  }

  add(){

    

    if(this.stopped, this.bet, this.delay, this.delay_start, this.delay_end, this.move_down_bet, this.move_right_bet, this.bet_fifa){           
        this.addContinue("")

    } else {
      this.uiUtils.showAlertError(this.dataText.checkAllFields)
    }

    
  } 

  uploadWithPic(){    
    
    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)
    loading.present()

    this.storage.uploadPicture(this.base64Image)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          loading.dismiss()
          this.addContinue(url)
          

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert(this.dataText.warning, err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert(this.dataText.warning, error).present()
      })        
  }  
  
  addContinue(url: string){

    this.db.addSettings(this.stopped, this.bet, this.delay, this.delay_start, this.delay_end, this.move_down_bet, this.move_right_bet, this.bet_fifa, this.robo_tirosecovirtual, this.robo_megabolt, this.meta_dia )
      .then( () => {

        this.getConfig()
        this.uiUtils.showAlert(this.dataText.success, this.dataText.addedSuccess).present()
        this.navCtrl.pop()
      })
  }

  save(){
    console.log(this.key)
    

    this.db.updateSettings(this.key, this.stopped, this.bet, this.delay, this.delay_start, this.delay_end, this.move_down_bet, this.move_right_bet, this.bet_fifa, this.robo_tirosecovirtual, this.robo_megabolt, this.meta_dia)
    .then( () => {

      this.getConfig()
      this.uiUtils.showAlert(this.dataText.success, this.dataText.savedSuccess).present()
      this.navCtrl.pop()
    })  
  }

  goBack(){
    this.navCtrl.pop()
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: this.dataText.selectImage,
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
          text: this.dataText.cancel,
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null
        }
      ]
      
    });
    actionSheet.present();
  }    

  handlerCamera(){
    if(! this.dataInfo.isWeb)
      this.grabPicture()
    else
      this.uiUtils.showAlert(this.dataText.warning, this.dataText.unavailable).present()
  }

  handlerGalery(){
    if(! this.dataInfo.isWeb)
      this.accessGallery()
    else
      this.uiUtils.showAlert(this.dataText.warning, this.dataText.unavailable).present()    
  }

  selectPicture(){
      this.openMenu()
  }  

  grabPicture() {
 
    let loading = this.uiUtils.showLoading(this.dataText.loading)      
    loading.present();

    this.camera.grabPicture().then((imageData) => {
            
      this.selectedPhoto  = this.dataInfo.dataURItoBlob('data:image/jpeg;base64,' + imageData);                  
      this.base64Image = 'data:image/jpeg;base64,' + imageData
      this.photoChanged = true
      loading.dismiss()

    }, (err) => {
      loading.dismiss()
    });
   }

    onSuccess = (snapshot) => {        
    this.base64Image = snapshot.downloadURL;
  }
  
  onError = (error) => {
    console.log('error', error);
  }

  accessGallery(){    
     this.camera.getPicture().then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData
      this.photoChanged = true

    }, (err) => {
     console.log(err);
    });
   }

  delPicture(){
    this.base64Image = ""
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


  edit(data){
    console.log(data)

    this.key = data.payload.key
    this.bet = data.payload.val().bet
    this.delay = data.payload.val().delay
    this.delay_start = data.payload.val().delay_start
    this.delay_end = data.payload.val().delay_end
    this.move_down_bet = data.payload.val().move_down_bet
    this.move_right_bet = data.payload.val().move_right_bet
    this.bet_fifa = data.payload.val().bet_fifa    
    this.meta_dia = data.payload.val().meta_dia

    this.robo_megabolt = data.payload.val().robo_megabolt    
    this.robo_tirosecovirtual = data.payload.val().robo_tirosecovirtual    

  }


}

