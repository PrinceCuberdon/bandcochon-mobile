import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { BandcochonProvider } from '../providers/bandcochon/bandcochon';

@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html'
})
export class PreferencesPage {

  constructor(
    private events: Events,
    private bandcochon: BandcochonProvider) { }

  logout() {
    console.log('lougout from servier');
    this.bandcochon.logout();
    console.log('Sending event');
    this.events.publish('user:logout');
    console.log('The event is sended');
  }
}
