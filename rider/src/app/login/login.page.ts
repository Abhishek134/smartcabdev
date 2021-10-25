import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth.service';
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {environment, ENABLE_SIGNUP} from 'src/environments/environment.prod';
import {MenuController} from '@ionic/angular';
import {IonicComponentService} from '../services/ionic-component.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    appName;
    langArr = [];
    lang = 'en';
    email: string = "";
    password: string = "";
    isRegisterEnabled: any = true;
    user = {};


    constructor(private authService: AuthService,
                private translate: TranslateService,
                private commonService: CommonService,
                private router: Router,
                private menuCtrl: MenuController,
                private ionicComponentService: IonicComponentService,
                private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
        this.isRegisterEnabled = ENABLE_SIGNUP;
        this.appName = environment.appName;
        this.menuCtrl.enable(false);
        this.langArr = environment.langArr;
        this.lang = this.commonService.getLang();
    }

    ngOnInit() {
    }

    changeLang() {
        this.commonService.changeLang(this.lang);
    }

    login() {
        this.commonService.showLoader();
        if (this.email.length == 0 || this.password.length == 0) {
            this.commonService.showAlert("Invalid Credentials");
        } else {
            // this.commonService.showLoader();
            this.ionicComponentService.presentLoading();
            this.authService.login(this.email, this.password).then(authData => {

                // this.commonService.hideLoader();
                this.ionicComponentService.dismissLoading();

                this.authService.getUser(this.authService.getUserData().uid).snapshotChanges().pipe(take(1)).subscribe((snapshot: any) => {
                    this.user = {uid: snapshot.key, ...snapshot.payload.val()};
                    // this.user.isEmailVerified = this.authService.getUserData().emailVerified;
                    console.log('pptg', this.user);

                    console.log('check is passenger', snapshot.passenger);

                    console.log('This is Passenger');
                    this.router.navigateByUrl('/home');
                });


                // this.router.navigateByUrl('/startup');
            }, error => {
                // this.commonService.hideLoader();
                this.ionicComponentService.dismissLoading();
                this.commonService.showToast(error.message);
            });
        }

        this.commonService.hideLoader();

    }


}
