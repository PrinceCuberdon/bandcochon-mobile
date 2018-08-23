import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BandcochonProvider } from "../../providers/bandcochon/bandcochon";
import { TabsPage } from "../tabs/tabs";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: 'page-ping',
  templateUrl: 'ping.html',
})
export class PingPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public bandcochon: BandcochonProvider,
    public alertCtrl: AlertController,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    this.bandcochon.ping().then((value: boolean) => {
      this.navCtrl.setRoot(TabsPage);
    }).catch((value: boolean) => {
      if (value === true) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.alertCtrl.create({
          title: "Erreur",
          subTitle: "Impossible de connecter le serveur.",
          buttons: [{
            text: 'OK',
            handler: (data) => {
              this.platform.exitApp();
            }
          }]
        }).present();
      }
    });
  }
}
