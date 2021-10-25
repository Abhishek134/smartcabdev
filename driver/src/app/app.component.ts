import {Component, ViewChildren, QueryList} from '@angular/core';
import { Platform, ModalController, ActionSheetController, PopoverController, IonRouterOutlet, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './services/auth.service';
import {TripService} from './services/trip.service';
import {TRIP_STATUS_WAITING, TRIP_STATUS_GOING} from 'src/environments/environment.prod';
import {AngularFireAuth} from '@angular/fire/auth';
import {DriverService} from './services/driver.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {Storage} from '@ionic/storage';
import {CommonService} from './services/common.service';
import { HTTP } from '@ionic-native/http/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';

import {
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';

// import { AppUpdate } from '@ionic-native/app-update';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'HOME',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'MY_TRIPS',
            url: '/history',
            icon: 'time'
        },
        {
            title: 'Withdraw Earnings',
            url: '/wallet',
            icon: 'wallet'
        },
        {
            title: 'Mobile Money Deposit',
            url: '/deposit',
            icon: 'wallet'
        },
        {
            title: 'Pay SmartCabs',
            url: '/payment',
            icon: 'card'
        },


        {
            title: 'NOTIFICATIONS',
            url: '/notifications',
            icon: 'notifications'
        },

        {
            title: 'Contact Support',
            url: '/complains',
            icon: 'help'
        },
        {
            title: 'SETTINGS',
            url: '/settings',
            icon: 'settings'
        }


    ];

    positionTracking: any;
    driver: any;
    user: any = {};

    // hardware back button
    // set up hardware back button event.
    lastTimeBackPress = 0;
    timePeriodToExit = 2000;

    subscribe: any;


    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private translate: TranslateService,
                private afAuth: AngularFireAuth,
                private tripService: TripService,
                private driverService: DriverService,
                private authService: AuthService,
                private router: Router,
                private bgmode: BackgroundMode,
                private storage: Storage,
                private common: CommonService,
                private actionSheetCtrl: ActionSheetController,
                private popoverCtrl: PopoverController,
                private statusBar: StatusBar,
                public modalCtrl: ModalController,
                // public toast: Toast,
                public menu : MenuController,
                // private oneSignal: OneSignal
                // private appUpdate: AppUpdate,
                private http : HTTP,
                private backgroundMode: BackgroundMode,
                private insomnia: Insomnia,
                // private androidPermissions: AndroidPermissions
                ) {



        this.translate.setDefaultLang('en');
        let lang = localStorage.getItem('lang');
        console.log(lang);
        if (lang == null || lang === undefined)
            this.translate.use('en');
        else
            this.translate.use(lang);
        this.initializeApp();


        // Initialize BackButton Event.
        // this.backButtonEvent();
        this.subscribe = this.platform.backButton.subscribeWithPriority(666666, () => {
            if (
                window.confirm("Do you want to Minimize Smart Cabs?")
            ) {
                navigator["app"].exitApp()
            }
        })

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            // this.splashScreen.hide();
            // check for login stage, then redirect

            this.insomnia.keepAwake()
                .then(
                    () => console.log('successly awake'),
                    () => console.log('error')
                );

            // this.insomnia.allowSleepAgain()
            //     .then(
            //         () => console.log('success'),
            //         () => console.log('error')
            //     );

            this.afAuth.authState.subscribe(authData => {
                if (authData != null) {
                    let root: any = '/home';

                    // check for uncompleted trip
                    this.common.showLoader();
                    this.tripService.getTrips().valueChanges().pipe(take(1)).subscribe((trips: any) => {
                        console.log(trips);
                        trips.forEach(trip => {
                            if (trip.status === TRIP_STATUS_WAITING || trip.status === TRIP_STATUS_GOING) {
                                this.tripService.setCurrentTrip(trip.key);
                                root = '/pickup';
                            }
                        });

                        this.user = this.authService.getUserData();
                        this.driverService.setUser(this.user);
                        this.driverService.getDriver().valueChanges().subscribe(snapshot => {
                            console.log(snapshot);
                            this.driver = snapshot;
                        });

                        if (this.platform.ready()) {
                            this.router.navigateByUrl(root);
                        }

                    });

                    this.common.hideLoader();
                } else {

                    this.router.navigateByUrl('/login', {skipLocationChange: true, replaceUrl: true});
                    // this.router.navigateByUrl('/startup');

                    this.driver = null;
                }
            });
            this.storage.get('iondriver_settings').then(data => {
                if (data != null && data !== undefined) {
                    let res = JSON.parse(data);
                    if (res.bgmode) this.common.enableBgMode();
                    else this.common.disableBgMode();
                }
            });

            setTimeout(() => {
                this.splashScreen.hide();
            }, 1000);

            // this.backgroundMode.enable();
            // this.backgroundMode.disableWebViewOptimizations();
            // this.backgroundMode.wakeUp();
            // this.backgroundMode.moveToForeground();
            // this.backgroundMode.overrideBackButton();
            // this.backgroundMode.unlock();
        //    PERMISSIONS

            // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            //     result => console.log('Has permission?',result.hasPermission),
            //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
            // );
            //
            // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.GET_ACCOUNTS]);



        });

    }

    logout() {
        this.authService.logout().then(() => {
            this.playAudio5();
            this.router.navigateByUrl('/login/', {replaceUrl: true})
        });
    }

    playAudio5() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH5);
            audio.load();
            audio.play();
        }
    }

    // playAudio4() {
    //     if (PLAY_AUDIO_ON_REQUEST == true) {
    //         let audio = new Audio(AUDIO_PATH4);
    //         audio.load();
    //         audio.play();
    //     }}

    //    --- Hardware Back Button ---
    // active hardware back button
    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {
            // close action sheet
            try {
                const element = await this.actionSheetCtrl.getTop();
                if (element) {
                    element.dismiss();
                    return;
                }
            } catch (error) {
            }

            // close popover
            try {
                const element = await this.popoverCtrl.getTop();
                if (element) {
                    element.dismiss();
                    return;
                }
            } catch (error) {
            }

            // close modal
            try {
                const element = await this.modalCtrl.getTop();
                if (element) {
                    element.dismiss();
                    return;
                }
            } catch (error) {
                console.log(error);

            }

            // close side menua
            try {
                const element = await this.menu.getOpen();
                if (element) {
                    this.menu.close();
                    return;

                }

            } catch (error) {

            }

            this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
                if (outlet && outlet.canGoBack()) {
                    outlet.pop();

                } else if (this.router.url === '/home') {
                    if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                        // this.platform.exitApp(); // Exit from app
                        // navigator['app'].exitApp(); // work in ionic 4

                        this.subscribe = this.platform.backButton.subscribeWithPriority(666666, () => {
                            if (window.confirm("Do you want to exit Smart Cabs")) {
                                navigator["app"].exitApp()
                            }
                        })

                    } else {

                        // this.toast.show(
                            // `Press back again to exit App.`,
                            // '2000',
                            // 'center')
                            // .subscribe(toast => {
                            //     // console.log(JSON.stringify(toast));
                            // });


                        // if (window.confirm("Do you want to exit Smart Cabs")) {
                        //     navigator["app"].exitApp()
                        // }

                        this.lastTimeBackPress = new Date().getTime();
                    }
                }
            });
        });
    }



}
