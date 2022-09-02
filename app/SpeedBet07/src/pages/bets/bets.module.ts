import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BetsPage } from './bets';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    BetsPage,
  ],
  imports: [
    IonicPageModule.forChild(BetsPage),
    IonicSelectableModule
  ],
})
export class BetsPageModule {}
