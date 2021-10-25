import {Component, OnInit} from '@angular/core';
import {environment, ENABLE_SIGNUP} from 'src/environments/environment.prod';
import {CommonService} from '../services/common.service';
import {AuthService} from '../services/auth.service';
import {FirebaseX} from '@ionic-native/firebase-x/ngx';
import {AngularFireDatabase} from '@angular/fire/database';
import {Router} from "@angular/router";



@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
    langArr = [];
    lang = 'en';
    isPushEnabled = false;
    user: any = {};

    constructor(
        private commonService: CommonService,
        private authService: AuthService,
        private db: AngularFireDatabase,
        private fcm: FirebaseX,
        private router: Router,
    ) {
        this.langArr = environment.langArr;
        this.lang = this.commonService.getLang();
    }

    ngOnInit() {
        this.authService.getUser(this.authService.getUserData().uid).valueChanges().subscribe(user => {
            this.user = user;
        });
    }

    changeLang() {
        this.commonService.changeLang(this.lang);
    }

    change() {
        console.log(!this.isPushEnabled);
        this.db.object('passengers/' + this.authService.getUserData().uid).update({isPushEnabled: !this.isPushEnabled}).then(() => {
            console.log(this.isPushEnabled);
            if (this.isPushEnabled) {
                this.fcm.getToken().then(token => {
                    this.db.object('passengers/' + this.authService.getUserData().uid).update({pushToken: token});
                });
                this.commonService.showToast('Settings Updated');
            } else {
                this.db.object('passengers/' + this.authService.getUserData().uid).update({pushToken: ''});
                this.commonService.showToast('Settings Updated');
            }


        }).catch(() => {
            this.commonService.showToast('Something went wrong');
        });
    }

}
