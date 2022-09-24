import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OddsPage } from './odds';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    OddsPage,
  ],
  imports: [
    IonicPageModule.forChild(OddsPage),
    IonicSelectableModule

  ],
})
export class OddsPageModule {}
