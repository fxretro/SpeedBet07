import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonitorFifaPage } from './monitor-fifa';

@NgModule({
  declarations: [
    MonitorFifaPage,
  ],
  imports: [
    IonicPageModule.forChild(MonitorFifaPage),
  ],
})
export class MonitorFifaPageModule {}
