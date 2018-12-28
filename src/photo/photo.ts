import { Component } from '@angular/core';
import { ActionSheetController, NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { BandcochonProvider } from "../providers/bandcochon/bandcochon";
import { Dialogs } from '@ionic-native/dialogs';


@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  pictures = [];
  description = "";
  position = null;

  constructor(
    private navCtrl: NavController,
    private camera: Camera,
    private geolocation: Geolocation,
    private actionSheetCtrl: ActionSheetController,
    private bandcochon: BandcochonProvider,
    private dialogs: Dialogs,
    private loadingCtrl: LoadingController,
  ) { }

  // On page load, take a picture
  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({ content: "Recherche de votre position actuelle par GPS" });
    loading.present();

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then((pos: Geoposition) => {
        loading.dismiss();
        this.position = pos;
        this.onTakeAPicture();
      })

      .catch((err) => {
        this.displayError(
          "Erreur pendant la localisation",
          `Impossible de connaitre votre position car ${err}`
        );
      });
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
    this.camera.getPicture(options)

      .then((imgData) => {
        this.pictures.push(imgData);
      })

      .catch((reason: string) => {
        this.displayError(
          "Erreur pendant la prise d'image",
          `Impossible de prendre une photo car ${reason}`
        );
      });
  }

  displayError(title: string, message: string): void {
    this.dialogs.alert(message,title);
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
          this.dialogs.alert("Impossible d'envoyer les images.", 'Erreur réseau');
        }
      );

  }
}
