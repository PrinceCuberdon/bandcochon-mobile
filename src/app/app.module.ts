import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PhotoPage } from "../pages/photo/photo";
import { PingPage } from '../pages/ping/ping';
import { LoginPage } from "../pages/login/login";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { HttpClientModule } from '@angular/common/http';
import { BandcochonProvider } from '../providers/bandcochon/bandcochon';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { ForgottenPasswordPage } from '../pages/forgotten-password/forgotten-password';

@NgModule({

  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
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
    ContactPage,
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
    BackgroundGeolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BandcochonProvider,
  ]
})
export class AppModule { }
