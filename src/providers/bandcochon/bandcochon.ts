import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Geoposition } from "@ionic-native/geolocation";

interface ISimpleResponse {
  token: string;
}

@Injectable()
export class BandcochonProvider {
  static ENDPOINT = 'http://192.168.1.20:8000/api/v1/';
  static IMAGES = BandcochonProvider.ENDPOINT + 'pictures/';
  static PING = BandcochonProvider.ENDPOINT + 'ping/';
  static LOGIN = BandcochonProvider.ENDPOINT + 'auth/login/';
  static LOGOUT = BandcochonProvider.ENDPOINT + 'auth/logout/';

  token: string;

  constructor(public http: HttpClient) {
    //this.getToken().then((t) => this.token = t).catch((err) => this.token = null);
  }

  /**
   * Send the images to the endpoint
   *
   * @param {Array<string>} pictures The list of pictures
   * @param {string} comment The description
   * @returns {Observable<any>}
   */
  sendPictures(pictures: Array<string>, position: Geoposition, comment: string): Observable<any> {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    return this.http.post(BandcochonProvider.IMAGES, {
      pictures, comment, latitude, longitude
    }, {
        headers: { 'x-auth-token': this.token }
      });
  }

  /**
   * Ping the server with an API to know if it's alive
   * 
   * @returns {Promise}
   */
  ping(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(BandcochonProvider.PING).subscribe((value: ISimpleResponse) => {
        this.token = value.token;
        resolve(true);
      }, (err) => {
        if (err.status === 403) {
          reject(true);
        } else {
          reject(false);
        }
      });
    });
  }


  login(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post(BandcochonProvider.LOGIN, { email, password }).subscribe((value: ISimpleResponse) => {
        this.token = value.token;
        resolve(value.token);
      }, (err) => {
        reject(err);
      });
    });
  }
}
