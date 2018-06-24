import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {BandcochonProvider} from "../../providers/bandcochon/bandcochon";
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private bandcochon: BandcochonProvider,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {}

  onLogin(): void {
    const loading = this.loadingCtrl.create({
      content: "Un instant s'il vous plaît..."
    });
    loading.present();

    this.bandcochon.login(this.email, this.password).then(() => {
      loading.dismissAll();
      this.navCtrl.setRoot(TabsPage);
    }).catch((err) => {
      loading.dismissAll();
      this.alertCtrl.create({
          title: "Erreur d'identifiant",
          subTitle: "email ou mot de passe non reconnu.",
          buttons: ['OK'],
        });
    });
  }
}
