import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { BandcochonProvider } from "../../providers/bandcochon/bandcochon";


@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  pictures = [];
  description = "";
  position = null;

  constructor(private navCtrl: NavController,
    private camera: Camera,
    private geolocation: BackgroundGeolocation,
    private actionSheetCtrl: ActionSheetController,
    private bandcochon: BandcochonProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  // On page load, take a picture
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
        this.position = position;
        loading.dismiss();        
        this.onTakeAPicture();
        this.geolocation.finish();
      },
      (err) => {
        loading.dismiss();

        this.displayError(
          "Erreur pendant la localisation",
          `Impossible de connaitre votre position car ${err}`
        );
        this.geolocation.finish();
      });
      this.geolocation.start();
  }


  /**
   * Test if there's pictures taken
   * @returns {boolean}
   */
  havePictures(): boolean {
    return this.pictures.length > 0;
  }

  /**
   * Take a picture by calling the camera plugin
   */
  onTakeAPicture() {
    const options: CameraOptions = {
      quality: 75,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
    };

    // Get the picture
    this.camera.getPicture(options).then((imgData) => {
      this.pictures.push(imgData);
    }).catch((reason: string) => {
      this.displayError(
        "Erreur pendant la prise d'image",
        `Impossible de prendre une photo car ${reason}`
      );
    });
  }

  displayError(title: string, subTitle: string): void {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK'],
    });
  }

  /**
   * Display an option dialog (mainly delete)
   *
   * @param picture The picture as a long base64 image
   */
  onDisplayOptions(picture: string): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Actions pour l'image",
      buttons: [{
        text: 'Supprimer',
        handler: () => {
          const index = this.pictures.indexOf(picture);
          if (index > -1) {
            this.pictures.splice(index, 1);
          }
        }
      }, {
        text: 'Annuler',
        role: 'cancel',
      }],
    });
    actionSheet.present();
  }

  /**
   * Cancel the took
   */
  onCancelPictures(): void {
    this.pictures = [];
    this.description = '';
    this.navCtrl.pop();
  }

  /**
   * Get a well formated string to display into an HTML img tag.
   *
   * @param picture The picture in base64 to display
   */
  getDisplayableBase64(picture: string): string {
    return 'data:image/jpeg;base64,' + picture;
  }

  /**
   * Send all pictures in memory
   */
  onSendPictures() {
    const loading = this.loadingCtrl.create({ content: 'Transfert des images' })
    loading.present();

    this.bandcochon.sendPictures(this.pictures, this.position, this.description)
      .subscribe(
        (res: Response) => {
          loading.dismiss();
          this.pictures = [];
          this.navCtrl.pop();
        },

        (err) => {
          // Display error message
          loading.dismiss();
          this.alertCtrl.create({
            title: "Erreur",
            subTitle: "Il fallait bien que ça merde " + err.message,
            buttons: ['OK'],
          }).present();
        }
      );
  }
}
