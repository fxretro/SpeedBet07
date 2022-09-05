import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, Platform, NavParams, MenuController, Events } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { StorageProvider } from '../../providers/storage/storage';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTextProvider } from '../../providers/data-text/data-text'


@IonicPage()
@Component({
  selector: 'page-clients-add',
  templateUrl: 'clients-add.html',
})
export class ClientsAddPage {

  @ViewChild('nameInput') nameInput;

  public formGroup: FormGroup;  
  
  searchControl: FormControl;
  searching: any = false;  
  payload: any 


  constructor(
    public navCtrl: NavController, 
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public uiUtils: UiUtilsProvider,    
    public storage: StorageProvider, 
    public navParams: NavParams,
    public events: Events,
    public menu: MenuController,
    public db: DatabaseProvider,    
    private formBuilder: FormBuilder,
    public dataText: DataTextProvider,
    public dataInfo: DataInfoProvider) {              
  }

  ngOnInit() {
    this.initForm()    
  }

  ionViewDidLoad() {

    if(this.dataInfo.isHome)
      this.startInterface()    
    else
      this.navCtrl.setRoot('LoginPage')              
  }

  startInterface(){
    
    this.payload = this.navParams.get('payload')    

    if(this.payload)
      this.loadInfo()
  
  }

 
  nameInputChanged(){

  }
  

  initForm() {    
        
    this.formGroup = this.formBuilder.group({              
      name: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(40)]],           
    });
  }
  
 
  loadInfo(){   
    this.menu.enable(true);
    this.loginInfoUser()   
  }   

  loginInfoUser(){
    
    let payload = this.payload    

    this.formGroup.patchValue({     
      name: payload.name,      
   
    })    
   
  
  }
 
  save(){

    if(this.formGroup.valid){

      let alert = this.uiUtils.showConfirm(this.dataText.warning, "Tem certeza?")  
      alert.then((result) => {
  
        if(result){    
          
          if(this.payload)
            this.savedOk()    
          else
            this.add()
        }
          
          
      })   
      .catch((error) => {
        this.uiUtils.showAlertError(error)
      })

    }            
      
    else {            
      this.uiUtils.showAlertError(this.dataText.checkAllFields)   
    }
      

  }


  add(){                    

    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)
    loading.present()
          
    this.db.addClient(
      this.formGroup.value.name)

  .then( () =>{
    
      loading.dismiss()

      this.uiUtils.showAlertSuccess("Cliente adicionado com sucesso")
      .then( () => {

        this.navCtrl.pop()     
        
      })      
    })

    .catch( (error) => {      
      loading.dismiss()
      this.uiUtils.showAlertError(this.dataText.errorRegister9)
    })
    
    
    
  }


  savedOk(){                    

    let loading = this.uiUtils.showLoading(this.dataText.pleaseWait)
    loading.present()
          
    this.db.updateClient(
      this.payload.key,      
      this.formGroup.value.name)

  .then( () =>{
    
      loading.dismiss()

      this.uiUtils.showAlertSuccess("Cliente atualizado com sucesso")
      .then( () => {

        this.navCtrl.pop()     
        
      })      
    })

    .catch( (error) => {      
      loading.dismiss()
      this.uiUtils.showAlertError(this.dataText.errorRegister9)
    })
    
    
    
  }


  
}
