import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { BandcochonProvider } from '../providers/bandcochon/bandcochon';

@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {
  public email: string = '';
  public username: string = '';
  public password: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dialogs: Dialogs,
    private bandcochon: BandcochonProvider) {
  }

  onCreate() {
    this.cleanEntries();

    if (!this.validateEmail(this.email)) {
      this.displayError('Erreur', "Votre email n'est pas valide");
      return;
    }

    if (this.password.length < 6) {
      this.displayError('Erreur', 'Votre mot de passe doit faire au minimum 6 caractères.');
      return;
    }

    this.bandcochon.createAccount(this.email, this.password, this.username)

      .then(status => {
        this.displayError("Création du compte",
          "Vous venez de recevoir un email pour confirmer la création de votre compte." +
          " Un fois validé, vous pourrez vous connecter avec l'application.")
          .then(() => {
            this.navCtrl.popToRoot();
          })
          .catch(() => { });
      })

      .catch(err => {
        let message = (() => {
          if (err.status == 403) {
            return "Impossible de créer votre compte, car l'adresse email ou le nom de chasseur est déjà pris.";
          } else {
            return `Impossible de créer votre compte. Error:  ${err.message}`;
          }
        })();

        this.displayError('Erreur', message);
      });

  }

  private validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  private cleanEntries() {
    this.email = this.email.trim();
    this.username = this.username.trim();
    this.password = this.password.trim();
  }


  private displayError(title: string, message: string): Promise<any> {
    return this.dialogs.alert(message, title);
  }
}
