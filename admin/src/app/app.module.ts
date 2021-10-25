import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from 'src/environments/environment.prod';
import {DataTablesModule} from 'angular-datatables';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { PapaParseModule } from 'ngx-papaparse';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';


@NgModule({
    declarations: [AppComponent,
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            mode: 'md'
        }),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        DataTablesModule,
        BrowserAnimationsModule,
        MatMenuModule,
        HttpClientModule,
        PapaParseModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        File,
        SocialSharing
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
