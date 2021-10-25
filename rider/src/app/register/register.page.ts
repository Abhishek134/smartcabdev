import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../services/common.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MenuController, Platform} from '@ionic/angular';
import {environment} from 'src/environments/environment.prod';
import {IonicComponentService} from './../services/ionic-component.service';

import {ModalController} from '@ionic/angular';
import {TermsPage} from "../terms/terms.page";


@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


    appName;
    email: string = "";
    password: string = "";
    name: string = "";
    phoneNumber: string = "";
    isAccepted: boolean = false;
    // balance: number = 0.0;

    constructor(private router: Router,
                private authService: AuthService,
                private commonService: CommonService,
                private translate: TranslateService,
                private menuCtrl: MenuController,
                private platform: Platform,
                private modalController: ModalController,
                private ionicComponentService: IonicComponentService,) {
        this.menuCtrl.enable(false);
        this.appName = environment.appName;
    }

    ngOnInit() {
    }

    async signup() {
        if (this.email.length == 0 || this.password.length == 0 || this.name.length == 0 || this.phoneNumber.length == 0) {
            this.commonService.showToast("Invalid Credentials");
        } else {
            // this.commonService.showLoader();
            this.ionicComponentService.presentLoading();
            this.authService.register(this.email, this.password, this.name, this.phoneNumber, this.isAccepted).subscribe(authData => {
                // this.commonService.hideLoader();
                this.ionicComponentService.dismissLoading();
                this.router.navigateByUrl('/startup');
            }, error => {
                this.commonService.hideLoader();
                this.commonService.showToast(error.message);
            });
        }

    }

    openModal() {
        this.platform.ready().then(() => {
            this.modalController.create({component: TermsPage}).then((modalElement) => {

                modalElement.present();
            });
        });

    }




}
