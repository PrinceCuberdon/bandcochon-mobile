import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the BandcochonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BandcochonProvider {
  static ENDPOINT = ''; //http://192.168.1.20:8000/api/v1/';
  static IMAGES = BandcochonProvider.ENDPOINT + 'pictures/';

  constructor(public http: HttpClient) {}

  /**
   * Send the images to the endpoint
   *
   * @param {Array<string>} pictures The list of pictures
   * @param {string} comment The description
   * @returns {Observable<any>}
   */
  sendPictures(pictures: Array<string>, comment: string): Observable<any> {
    let lattitude = 0.;
    let longitude = 0.;

    return this.http.post(BandcochonProvider.IMAGES, {pictures, comment, lattitude, longitude});
  }

}
