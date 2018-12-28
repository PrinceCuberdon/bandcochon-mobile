import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';

import { AboutPage } from '../about/about';
import { PreferencesPage } from '../preferences/preferences';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { PhotoPage } from "../photo/photo";
import { PingPage } from '../ping/ping';
import { LoginPage } from "../login/login";
import { ForgottenPasswordPage } from '../forgotten-password/forgotten-password';
import { BandcochonProvider } from '../providers/bandcochon/bandcochon';
import { CreateAccountPage } from '../create-account/create-account';
import { Dialogs } from '@ionic-native/dialogs';

@NgModule({

  declarations: [
    MyApp,
    AboutPage,
    PreferencesPage,
    HomePage,
    TabsPage,
    PhotoPage,
    PingPage,
    LoginPage,
    CreateAccountPage,
    ForgottenPasswordPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    PreferencesPage,
    HomePage,
    TabsPage,
    PhotoPage,
    PingPage,
    LoginPage,
    CreateAccountPage,
    ForgottenPasswordPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,    
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BandcochonProvider,
    Dialogs
  ]
})
export class AppModule { }
