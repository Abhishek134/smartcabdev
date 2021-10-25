import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
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
import { HTTP } from '@ionic-native/http/ngx';
// --- popup import ---
import {TermsmodalPageModule} from './termsmodal/termsmodal.module';
import {ChatPageModule} from "./chat/chat.module";
import { BackgroundMode} from "@ionic-native/background-mode/ngx";

import { Insomnia } from '@ionic-native/insomnia/ngx';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        AppRoutingModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),

        BrowserModule,
        IonicModule.forRoot({
            mode: 'md'
        }),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),

        ChatPageModule,
        HttpClientModule,
        TermsmodalPageModule,


    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        BackgroundMode,
        FirebaseX,
        HTTP,

        Insomnia,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
