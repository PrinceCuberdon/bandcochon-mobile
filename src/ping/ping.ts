import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BandcochonProvider } from "../providers/bandcochon/bandcochon";
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-ping',
  templateUrl: 'ping.html'
})
export class PingPage {
  private loadingMessage: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public bandcochon: BandcochonProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    private geolocation: Geolocation,
  ) {
    this.loadingMessage = "Recherche du serveur BandCochon";
  }

  ionViewDidLoad() {
    this.bandcochon.ping()
      .then(() => {
        this.changePageOnSuccess(true);
      })

      .catch((value: boolean) => {
        if (value === true) {
          this.changePageOnSuccess(false);
        } else {
          this.displayPingError();
        }
      });
  }

  private changePageOnSuccess(value: boolean) {
    const connected: boolean = this.bandcochon.isConnected();

    this.searchGeolocation()
      .then(() => {
        const page = (connected && value) === true ? TabsPage : LoginPage;
        this.navCtrl.setRoot(page);
      })

      .catch((err) => {
        this.displayWrongGeolocationError();
      });
  }

  private displayErrorThenExit(msg: string): void {
    this.alertCtrl.create({
      title: "Erreur",
      subTitle: msg,
      buttons: [{
        text: 'OK',
        handler: (data) => {
          this.platform.exitApp();
        }
      }]
    }).present();
  }

  /**
   * Display the geolocation error dialog. 
   * This loading box is dismiss because the alert couldn't be displayed.
   * 
   * @param err The error message
   */
  private displayGeolocationDeviceError(err): void {
    this.displayErrorThenExit(`Impossible de connaitre votre position car ${err}`);
  }

  /**
   * Display the ping server error dialog. 
   * This loading box is dismiss because the alert couldn't be displayed.
   */
  private displayPingError(): void {
    this.displayErrorThenExit('Impossible de connecter le serveur.');
  }

  /**
   * Display the wrong position error
   */
  private displayWrongGeolocationError(): void {
    this.displayErrorThenExit(
      "Vous n'êtes pas en ce moment sur le territoire Réunionnais. Vous devriez utiliser " +
      "le site web pour envoyer les photos prises précédemment.");
  }

  /** 
   * Ensure we can publish the picture 
   */
  private searchGeolocation(): Promise<void> {
    this.loadingMessage = "Recherche de votre position actuelle par GPS";

    return new Promise((resolve, reject) => {
      const subscription = this.geolocation.watchPosition({ timeout: 30000, enableHighAccuracy: true })
        .subscribe((pos: Geoposition) => {
          if (pos['coords']) {
            subscription.unsubscribe();
            
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            this.loadingMessage = 'Position acquise.';

            this.bandcochon.ensureGeolocation({ lat, lng })
              .then(() => {
                resolve();
              })

              .catch(() => {
                reject();
              })

              .then(() => {
                this.geolocation
              })
          }
        },

          (error) => {
            this.displayGeolocationDeviceError(error);
            reject();
          });
    });
  }
}
