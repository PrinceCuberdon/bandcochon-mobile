import {Component} from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {BandcochonProvider} from "../../providers/bandcochon/bandcochon";

/**
 * Generated class for the PhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  pictures = [];
  description = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera,
              public actionSheetCtrl: ActionSheetController,
              public bandcochon: BandcochonProvider,
              public alertCtrl: AlertController) {
  }

  // On page load, take a picture
  ionViewDidLoad() {
    this.onTakeAPicture();
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

    // FIXME: Get the

    this.camera.getPicture(options).then((imgData) => {
      let base64Img = imgData;
      this.pictures.push(base64Img);
    }, (err) => {
      console.log(err);
    })

  }

  /**
   * Display an option dialog (mainly delete)
   *
   * @param picture The picture as a long base64 image
   * TODO Use indexes
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
    this.bandcochon.sendPictures(this.pictures, this.description).subscribe((res: Response) => {
      this.pictures = [];
      this.navCtrl.pop();
    }, (err) => {
      // Display error message
      this.alertCtrl.create({
        title: "Erreur",
        subTitle: "Il fallait bien que ça merde " + err.message,
        buttons: ['OK'],
      }).present();

    });
  }
}
