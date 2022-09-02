import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonitorPage } from './monitor';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    MonitorPage,
  ],
  imports: [
    IonicPageModule.forChild(MonitorPage),
    IonicSelectableModule
  ],
})
export class MonitorPageModule {}
