import { Component, OnInit } from '@angular/core';
import { Platform, Events, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PingPage } from '../ping/ping';

@Component({
  templateUrl: 'app.html'
})
export class MyApp  implements OnInit {
  rootPage: any = PingPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private events: Events) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    this.listenToEvents();
  }

  listenToEvents(): void {
  }
}
 