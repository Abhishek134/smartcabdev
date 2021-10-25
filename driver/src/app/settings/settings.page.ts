import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import {CommonService} from '../services/common.service';
import {CUSTOMER_CARE, environment} from "../../environments/environment.prod";
import {AuthService} from '../services/auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseX} from '@ionic-native/firebase-x/ngx';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    settings: any = {};
    support: any = CUSTOMER_CARE;
    langArr = [];
    lang = 'en';
    isPushEnabled = false;
    user: any = {};

    constructor(private translate: TranslateService,
                private storage: Storage,
                private common: CommonService,
                private authService: AuthService,
                private db: AngularFireDatabase,
                private fcm: FirebaseX) {

        this.langArr = environment.langArr;
        this.lang = this.common.getLang();
    }

    ngOnInit() {
        this.authService.getUser(this.authService.getUserData().uid).valueChanges().subscribe(user => {
            this.user = user;
        });
        this.storage.get('iondriver_settings').then(data => {
            if (data != null && data != undefined)
                this.settings = JSON.parse(data);
        })
    }

    changeLang() {
        this.common.changeLang(this.lang);
    }


    change() {
        console.log('change is clicked');
    }

    save() {
        if (this.settings.bgmode) {
            this.common.enableBgMode();
        }
        else {
            this.common.disableBgMode()
        }
        this.storage.set('iondriver_settings', JSON.stringify(this.settings)).then(data => this.common.showToast("Updated Settings")).catch(err => console.log(err));
    }
}