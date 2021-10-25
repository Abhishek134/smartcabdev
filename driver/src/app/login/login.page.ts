import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ENABLE_SIGNUP, environment} from '../../environments/environment.prod';
import {CommonService} from '../services/common.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import {ModalController} from '@ionic/angular';
import {TermsmodalPage} from '../termsmodal/termsmodal.page';
import {
    AUDIO_PATH3,
    AUDIO_PATH5,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    userInfo: any = {};
    isRegisterEnabled = ENABLE_SIGNUP;
    langArr = [];
    lang = 'en';
    appName;

    constructor(public translate: TranslateService,
                private common: CommonService,
                private auth: AuthService,
                private router: Router,
                private menuCtrl: MenuController,
                private modalController: ModalController
                ) {
        this.menuCtrl.enable(false);
        this.appName = environment.appName;
        this.langArr = environment.langArr;
        this.lang = this.common.getLang();
    }

    changeLang() {
        this.common.changeLang(this.lang);
    }

    ngOnInit() {
    }

    // openModal(){
    //     this.modalController.create({component: TermsmodalPage}).then((modalElement)=>{
    //         modalElement.present();
    //     });
    // }

    login() {
        this.common.hideLoader();
        this. playAudio5();
        if (this.userInfo.email && this.userInfo.password) {
            // this.common.showLoader();
            this.auth.login(this.userInfo.email, this.userInfo.password).then(authData => {

                this.router.navigateByUrl('/home');
            }, error => {

                // this.common.showLoader();
                this.common.showToast(error.message);
            });
        } else {
            this.common.showToast('Please Enter valid Email Address & password');
        }
        this.common.hideLoader();

    }

    playAudio5() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH5);
            audio.load();
            audio.play();
        }
    }




}
