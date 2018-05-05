import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {PhotoPage} from "../photo/photo";
// import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController) {

  }

  /**
   * Take a picture with the camera module.
   */
  public onTakePicture() {
    this.navCtrl.push(PhotoPage);
  }
}
