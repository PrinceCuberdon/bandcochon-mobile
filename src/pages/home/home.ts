/**
 * Band Cochon Mobile - The mobile application for Bandcochon.re
 * (c) Prince Cuberdon 2011 and later
 * This application is part of the Band Cochon project - more at http://bandcochon.re
 */

import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { PhotoPage } from "../photo/photo";
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Observable } from 'rxjs/Observable';

/**
 * Main page component for Band Cochon mobile
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    private navCtrl: NavController,
    private geolocation: BackgroundGeolocation,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  /**
   * Try to get the device position
   */
  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({ content: "Recherche de votre position actuelle par GPS" });
    loading.present();

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      stopOnTerminate: false,
    };

    this.geolocation.configure(config).subscribe(
      (position: BackgroundGeolocationResponse) => {
        loading.dismiss();
        this.geolocation.finish();
      },

      (err) => {
        loading.dismiss();
        this.alertCtrl.create({
          title: "Erreur pendant la localisation",
          subTitle: `Impossible de connaitre votre position car ${err}`,
          buttons: ['OK'],
        });
    
        this.geolocation.finish();
      });

    this.geolocation.start();
  }
}
