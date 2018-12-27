import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { BandcochonProvider } from "../providers/bandcochon/bandcochon";
import { TabsPage } from '../tabs/tabs';
import { CreateAccountPage } from '../create-account/create-account';
import { ForgottenPasswordPage } from '../forgotten-password/forgotten-password';


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

  ionViewDidLoad() { }

  onLogin(): void {
    const loading = this.loadingCtrl.create({
      content: "Un instant s'il vous plaît..."
    });
    loading.present();

    this.bandcochon.login(this.email, this.password)
      // Success
      .then(() => {
        this.navCtrl.setRoot(TabsPage);
      })

      // On error
      .catch((err) => {
        this.alertCtrl.create({
          title: "Erreur d'identifiant",
          subTitle: "email ou mot de passe non reconnu.",
          buttons: ['OK'],
        }).present();
      })

      // Always
      .then(() => {
        loading.dismiss();
      });
  }

  /** 
   * The button "Create account" was pressed change the page
   */
  onCreateAccount() {
    this.navCtrl.push(CreateAccountPage);
  }

  onPasswordForgotten() {
    this.navCtrl.push(ForgottenPasswordPage);
  }
}
