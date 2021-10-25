import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AngularFireModule} from '@angular/fire';
import {environment} from 'src/environments/environment.prod';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {IonicStorageModule} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {FirebaseX} from '@ionic-native/firebase-x/ngx';
import {ChatPageModule} from './chat/chat.module'
import { Vibration } from '@ionic-native/vibration/ngx';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

import { LocalNotifications} from "@ionic-native/local-notifications/ngx";
import {TermsPageModule} from "./terms/terms.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AppRoutingModule,
        IonicModule.forRoot({
            mode: 'md'
        }),
        AngularFireModule.initializeApp(environment.firebase),
        BrowserModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        TermsPageModule,
        BrowserAnimationsModule,

        ChatPageModule,


    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        FirebaseX,
        LocalNotifications,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        Vibration

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
