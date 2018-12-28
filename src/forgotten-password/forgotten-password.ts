import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { BandcochonProvider } from '../providers/bandcochon/bandcochon';
import { Dialogs } from '@ionic-native/dialogs';


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
    private dialogs: Dialogs,
    private loadingCtrl: LoadingController) {
  }

  onSendEmail() {
    if (this.email.trim() === '') {
      this.displayError("Vous n'avez entré aucune adresse email, ce qui reste problématique pour vous identifier.");
      return;
    }

    const loading = this.displayLoading();

    this.bandcochon.forgotten(this.email)
      .then(() => {
        this.onIHaveACode()
      })
      .catch((err) => {
        this.displayError(`Cette adresse mail n'appartient pas à un utilisateur de bandcochon.`, 'Adresse inconnue');
      }).then(() => {
        loading.dismiss();
      });
  }

  onIHaveACode() {
    this.showMessage = true;
  }

  onSendCode() {
    if (this.password != this.confirm) {
      this.displayError("Le mot de passe et sa confirmation sont différents");
      return;
    }

    const loading = this.displayLoading();

    this.bandcochon.sendCode(this.code, this.email, this.password, this.confirm)
      .then(() => {
        this.displaySuccess('Mot de passe remplacé avec succès').then(() => {
          this.navCtrl.popToRoot();
        });
      })
      .catch((err) => {
        this.displayError('Mauvais code ou mauvaise adresse email.');
      })
      .then(() => {
        loading.dismiss();
      });
  }

  /* 
   * Display a more explicit error
   */
  private displayError(msg: string, title?: string): void {
    this.dialogs.alert(msg, title || 'Erreur')
  }

  private displaySuccess(msg: string): Promise<any> {
    return this.dialogs.alert(msg, 'Succés')
  }

  private displayLoading(): Loading {
    const loading = this.loadingCtrl.create({
      content: "Un instant s'il vous plaît..."
    });
    loading.present();

    return loading;
  }
}
