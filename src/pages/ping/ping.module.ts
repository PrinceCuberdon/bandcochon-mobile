import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PingPage } from './ping';

@NgModule({
  declarations: [
    PingPage,
  ],
  imports: [
    IonicPageModule.forChild(PingPage),
  ],
})
export class PingPageModule {}
