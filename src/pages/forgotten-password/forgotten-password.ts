import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BandcochonProvider } from '../../providers/bandcochon/bandcochon';


@Component({
  selector: 'page-forgotten-password',
  templateUrl: 'forgotten-password.html',
})
export class ForgottenPasswordPage {
  email: string = '';
  showMessage: boolean = false;
  code: string = '';
  password: string = '';
  confirm: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bandcochon: BandcochonProvider,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }
  // FIXME : Ajouter une spinner pour l'attente
  onSendEmail() {
    this.bandcochon.forgotten(this.email)
      .then(() => {
        this.onIHaveACode()
      })
      .catch((err) => {
        this.displayError(`Une erreur est survenue. Merci de réessayer ultérieurement.`);
      });
  }

  onIHaveACode() {
    this.showMessage = true;
  }

  onSendCode() {
    this.bandcochon.sendCode(this.code, this.email, this.password, this.confirm)
      .then(() => {
        this.displaySuccess('Mot de passe remplacé avec succès');
      })
      .catch((err) => {
        this.displayError('Une erreur est survenue. Merci de réessayer ultérieurement.');
      })
      .then(() => {
        this.navCtrl.first();
      });
  }

  /* 
   * Display a more explicit error
   */
  private displayError(msg: string): void {
    this.alertCtrl
      .create({
        title: "Erreur serveur",
        subTitle: msg,
        "buttons": ["OK"],
      })
      .present();
  }

  private displaySuccess(msg:string): void {
    this.alertCtrl
      .create({
        title: "Succès",
        subTitle: msg,
        "buttons": ["OK"],
      })
      .present();
  }
}
