import {Component} from '@angular/core';
import {Platform, ModalController, MenuController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',

    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },

        {
            title: 'DRIVER CATEGORIES',

            children: [

                {
                    title: 'Smart Go Bikes',
                    url: '/bikes',
                    icon: 'car'
                },
                {
                    title: 'Smart Go Mini',
                    url: '/mini',
                    icon: 'car'

                },
                {
                    title: 'Smart Go XL',
                    url: '/xl',
                    icon: 'car'
                },

            ]
        },

        {
            title: 'Riders & Drivers',
            url: '/drivers',
            icon: 'car'
        },


        {
            title: 'Passengers',
            url: '/passengers',
            icon: 'contacts'
        },
        {
            title: 'Trips',
            url: '/trips',
            icon: 'compass'
        },

        {
            title: 'Cancelled Trips',
            url: '/cancelledtrips',
            icon: 'compass'
        },

        {
            title: 'Withdraws',
            url: '/withdraws',
            icon: 'card'
        },
        {
            title: 'Coupons',
            url: '/promos',
            icon: 'cash'
        },
        {
            title: 'Notifications',
            url: '/notifications',
            icon: 'notifications'
        },
        {
            title: 'Settings & Currency',
            url: '/cars',
            icon: 'car'
        }
    ];


    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private menuCtrl: MenuController,
                private router: Router,
                private afAuth: AngularFireAuth) {
        this.initializeApp();
    }

    initializeApp() {

        this.afAuth.auth.onAuthStateChanged(auth => {
            console.log(auth);
            if (auth == null) {
                this.router.navigateByUrl('/login');
                this.menuCtrl.enable(false)
            }
            else {
                this.router.navigateByUrl('/home');
                this.menuCtrl.enable(true);
            }
        });

        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
