import {Injectable} from '@angular/core';
import {ToastController, AlertController, LoadingController, Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';

declare var cordova;

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    loader = null;

    constructor(private toast: ToastController,
                private alertCtrl: AlertController,
                private loadCtrl: LoadingController,
                private platform: Platform,
                private backgroundMode: BackgroundMode,
                private translate: TranslateService) {
    }

    showToast(message) {
        this.toast.create({message: message, duration: 2000}).then((res) => {
            res.present();
        });
    }

    showAlert(message) {
        this.alertCtrl.create({
            message: message,
            buttons: ['ok']
        }).then(res => res.present());
    }

    showLoader() {
        if (this.loader == null) {
            this.loadCtrl.create({spinner: 'circles', duration: 5000}).then(res => {
                this.loader = res;
                this.loader.present();
            });
        }

    }

    hideLoader() {
        if (this.loader != null) {
            this.loader.dismiss();
            this.loader = null;
        }
    }

    enableBgMode() {
        if (this.platform.is('android') || this.platform.is("ios")) {
            const options = {title: 'Smart Cabs', text: 'Driver App runs Background', hidden: false, silent: true};

            cordova.plugins.backgroundMode.setDefaults(options);
            cordova.plugins.backgroundMode.enable();
            console.log('method is called');
            this.backgroundMode.enable();
            this.backgroundMode.disableWebViewOptimizations();
            this.backgroundMode.wakeUp();
            this.backgroundMode.moveToForeground();
            this.backgroundMode.overrideBackButton();
            this.backgroundMode.unlock();

            cordova.plugins.backgroundMode.on('enable', () => {
                console.log('background mode activated !!!');
                cordova.plugins.backgroundMode.disableWebViewOptimizations();
                cordova.plugins.backgroundMode.disableBatteryOptimizations();


            });

        } else {
            this.showToast("Background mode only works on Device");
        }

    }

    disableBgMode() {
        cordova.plugins.backgroundMode.disable();
    }

    changeLang(lang) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }

    getLang() {
        let lang = localStorage.getItem('lang');
        if (lang == null || lang == undefined)
            return 'en';

        else
            return lang;
    }

}
