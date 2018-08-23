import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BandcochonProvider } from '../../providers/bandcochon/bandcochon';


@IonicPage()
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
    private alertCtrl: AlertController,
    private bandcochon: BandcochonProvider) {
  }

  ionViewDidLoad() {

  }

  onCreate() {
    let email = this.email.trim();
    let username = this.username.trim();
    let password = this.password.trim();

    if (!this.validateEmail(email)) {
      this.alertCtrl.create({
        title: "Erreur",
        subTitle: "Votre email n'est pas valide",
        buttons: ['OK']
      }).present();
      return;
    }

    this.bandcochon.createAccount(email, password, username)

      .then(status => {
        this.alertCtrl.create({
          title: "Création du compte",
          subTitle: "Vous venez de recevoir un email pour confirmer la création de votre compte. Un fois validé, vous pourrez vous connecter avec l'application.",
          buttons: ["OK"]
        })
        .present()
        .then(() => {
          this.navCtrl.popToRoot();
        })
        .catch(() => { });
      })

      .catch(err => {
        let message = "";

        if (err.status == 403) {
          message = "Impossible de créer votre compte, car l'adresse email ou le nom de chasseur est déjà pris.";
        } else {
          message = `Impossible de créer votre compte. Error:  ${err.message}`;
        }

        this.alertCtrl.create({
          title: "Erreur",
          subTitle: message,
          buttons: ["OK"]
        }).present();
      });
  }

  private validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
