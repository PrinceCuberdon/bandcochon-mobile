import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Geoposition } from '@ionic-native/geolocation';
import { Events } from 'ionic-angular';

interface ISimpleResponse {
  token: string;
}

interface Position {
  lat: number;
  lng: number;
}

@Injectable()
export class BandcochonProvider {
  static ENDPOINT = 'https://www.bandcochon.re/api/v1/';
  static IMAGES = BandcochonProvider.ENDPOINT + 'pictures/';
  static PING = BandcochonProvider.ENDPOINT + 'ping/';
  static LOGIN = BandcochonProvider.ENDPOINT + 'auth/login/';
  static LOGOUT = BandcochonProvider.ENDPOINT + 'auth/logout/';
  static CREATE_ACCOUNT = BandcochonProvider.ENDPOINT + 'auth/create/';
  static FORGOTTEN_PASSWORD = BandcochonProvider.ENDPOINT + 'auth/forgotten/';
  static RECOVER_PASSWORD = BandcochonProvider.ENDPOINT + 'auth/recover/';
  static SHOULD_POST = BandcochonProvider.ENDPOINT + 'ping/ensure_location/';

  token: string = null;

  constructor(
    public http: HttpClient,
    private events: Events) {
    this.token = localStorage.getItem('token');
  }

  /**
   * Send the images to the endpoint
   *
   * @param {Array<string>} pictures The list of pictures
   * @param {Geoposition} position The device position in decimal
   * @param {string} comment The description
   * @returns {Observable<any>}
   */
  sendPictures(pictures: Array<string>, position: Geoposition, comment: string): Observable<any> {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    return this.http.post(BandcochonProvider.IMAGES,
      { pictures, comment, latitude, longitude }, { headers: { 'x-auth-token': this.token } });
  }

  /**
   * Ping the server with an API to know if it's alive
   * 
   * @returns {Promise}
   */
  ping(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(BandcochonProvider.PING, { headers: { 'x-auth-token': this.token || '' } })
        .subscribe(
          (value: ISimpleResponse) => {
            let result = this.token == value.token;
            resolve(result);
          },

          (err) => {
            if (err.status === 403) {
              reject(true);
            } else {
              reject(false);
            }
          });
    });
  }

  /**
   * Should the user can post at his location
   */
  ensureGeolocation(position: Position): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(BandcochonProvider.SHOULD_POST, { position })
        .subscribe(
          (value) => { resolve(true) },
          (err) => { reject(err) }
        )
    });
  }

  /**
   * Try to signin
   * 
   * @param email The user email
   * @param password The user password
   * @returns {Promise}
   */
  login(email: string, password: string): Promise<string> {

    return new Promise((resolve, reject) => {
      this.http.post(
        BandcochonProvider.LOGIN,
        { email, password }
      )
        .subscribe(
          (value: ISimpleResponse) => {
            this.saveToken(value.token);
            resolve(this.token);
          },

          (err) => {
            reject(err);
          }
        );
    });
  }

  createAccount(email, password, username): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post(BandcochonProvider.CREATE_ACCOUNT, { email, password, username })
        .subscribe(
          (value: ISimpleResponse) => {
            resolve("yes");
          },

          (err) => {
            reject(err);
          })
    });
  }

  /**
   * Ask to send a code
   * 
   * @param email The user email
   */
  forgotten(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post(BandcochonProvider.FORGOTTEN_PASSWORD, { email })
        .subscribe(
          (value: ISimpleResponse) => {
            resolve(true);
          },

          (err) => {
            reject(false);
          }
        )
    });
  }

  /**
   * Send the code to recover the code
   * 
   * @param code The sended user code
   * @param email The user email
   * @param password The user password
   * @param confirm The user password (again)
   * @returns A promise with the server response
   */
  sendCode(code: string, email: string, password: string, confirm: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post(BandcochonProvider.RECOVER_PASSWORD, { code, email, password, confirm })
        .subscribe(
          (value) => {
            resolve(true);
          },

          (err) => {
            reject(false);
          }
        );
    });
  }

  /**
   * Test if the user has a token or not
   * 
   * @returns True if yes, False elsewhere
   */
  isConnected(): boolean {
    return this.token !== null;
  }

  /**
   * Disconnect from service. Call the server then remove the token
   * 
   */
  logout(): void {
    this.http.delete(BandcochonProvider.LOGOUT, { headers: { 'x-auth-token': this.token } })
      .subscribe(
        (value: ISimpleResponse) => {
          this.saveToken(value.token);
        });
  }

  /**
   * Save the connection token for future use
   * 
   * @param token The connection token
   */
  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', this.token);
  }
}
