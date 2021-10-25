import {AlertController, Platform} from '@ionic/angular';
import { Component } from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {TripService} from './services/trip.service';
import {PlatformLocation} from "@angular/common";
import { AuthService } from './services/auth.service';

import {
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';



@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    user: any = {};
    public appPages = [
        {
            title: 'HOME',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'MY RIDES',
            url: '/history',
            icon: 'time'
        },
        // {
        //   title: 'PAYMENTS',
        //   url: '/payments',
        //   icon: 'card'
        // },

        {
            title: 'CASHLESS',
            url: '/cashless',
            icon: 'card'
        },
        {
            title: 'NOTIFICATIONS',
            url: '/notifications',
            icon: 'notifications'
        },
        {
            title: 'SETTINGS',
            url: '/settings',
            icon: 'settings'
        },


    ];

    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private translate: TranslateService,
                private afAuth: AngularFireAuth,
                private router: Router,
                private tripService: TripService,
                private location: PlatformLocation,
                private authService: AuthService,
                private alertController: AlertController) {
        this.platform.ready().then(() => {
            this.initializeApp();
        })
    }

    async initializeApp() {
        this.platform.ready().then(() => {

            if (this.platform.is('cordova')) {
                setTimeout(() => {
                    this.splashScreen.hide();
                }, 500);
            }
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.translate.setDefaultLang('en');

            const lang = localStorage.getItem('lang');
            console.log(lang);
            if (lang == null || lang == undefined) {
                this.translate.use('en');
            } else {
                this.translate.use(lang);
            }

            this.afAuth.authState.subscribe(authData => this.user = authData);
            this.afAuth.authState.pipe(take(1)).subscribe(authData => {
                if (authData) {
                    this.tripService.getTrips().valueChanges().subscribe((trips: any) => {
                        trips.forEach(trip => {
                            if (trip.status === 'waiting' || trip.status === 'accepted' || trip.status === 'going') {
                                this.tripService.setId(trip.key);
                                this.router.navigateByUrl('tracking');
                            } else if (trip.status === 'finished') {
                                this.router.navigateByUrl('/home');
                                // this.router.navigateByUrl('/startup');
                            }
                        });
                    });
                    // this.router.navigateByUrl('/home');
                    // this.router.navigateByUrl('/startup');
                } else {
                    this.router.navigateByUrl('/login', {skipLocationChange: true, replaceUrl: true});
                }
            });





        });
    }


    playAudio5() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH5);
            audio.load();
            audio.play();
        }
    }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigateByUrl('/login');
        });
    }


}
