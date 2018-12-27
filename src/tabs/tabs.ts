import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { PreferencesPage } from '../preferences/preferences';
import { HomePage } from '../home/home';
import { NavController, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  prefRoot = PreferencesPage;

  constructor(public navCtrl: NavController, private events: Events) {
    this.events.subscribe('user:logout', () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
