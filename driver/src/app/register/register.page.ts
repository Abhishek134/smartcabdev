import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth.service';
import {CommonService} from '../services/common.service';
import {MenuController, Platform} from '@ionic/angular';
import {environment} from '../../environments/environment.prod';
import {ModalController} from '@ionic/angular';
import {TermsmodalPage} from '../termsmodal/termsmodal.page';
import {AngularFireStorage} from '@angular/fire/storage';
import {concatMap, last, take} from 'rxjs/operators';
import {Observable, pipe} from "rxjs";


@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    userInfo: any = {};
    step: any = 1;
    appName;

    // Upload declarations
    permituploadPercent$: Observable<number>;
    iduploadPercent$: Observable<number>;
    interpoluploadPercent$: Observable<number>;
    lcloadPercent$: Observable<number>;
    permitDownloadUrl$: Observable<string>;

    vehicleloadPercent$: Observable<number>;
    photoPercent$: Observable<number>;

    idbackuploadPercent$: Observable<number>;
    ninbackDownloadUrl$: Observable<string>;

    constructor(private translate: TranslateService,
                private platform: Platform,
                private auth: AuthService,
                private common: CommonService,
                private menuCtrl: MenuController,
                private modalController: ModalController,
                private afStorage: AngularFireStorage,

                ) {
        this.menuCtrl.enable(false);
        this.appName = environment.appName;
    }


    ngOnInit() {

    }

    openModal() {
        this.platform.ready().then(() => {
            this.modalController.create({component: TermsmodalPage}).then((modalElement) => {
                modalElement.present();
            });
        });
    }

    nextPage() {
        this.step = this.step + 1;
    }

    previousPage() {
        this.step = this.step - 1;
    }

    signup() {

        if (this.userInfo.password == this.userInfo.repassword) {

            this.auth.register(this.userInfo).subscribe(
                (data) => {
                    this.common.showLoader();
                    this.common.hideLoader();
                    this.common.showToast('Account Created Successfully');
                },
                (err) => {
                    this.common.showLoader();
                    this.common.hideLoader();
                    this.common.showToast(err.message);
                }
            );
        }
        else {
            this.common.showToast('Your Password does not much!');
            console.log('Passwords did not much!')
        }
    }

//   =====  UPLOADS  =====

    choosePhoto() {
        document.getElementById('passphoto').click();
    }

    uploadPhoto() {
        for (const selectedFile4 of [(document.getElementById('passphoto') as HTMLInputElement).files[0]]) {
            console.log(selectedFile4.name);
            const path = '/users/' + Date.now() + `${selectedFile4.name}`;
            const task = this.afStorage.upload(path, selectedFile4);
            this.photoPercent$ = task.percentageChanges();
            const ref = this.afStorage.ref(path);
            ref.put(selectedFile4).then(() => {
                this.common.showLoader();
                ref.getDownloadURL().subscribe(url => this.userInfo.photo2URL = url);
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });
        }
    }


    chooseDocs() {
        document.getElementById('ninFront').click();
    }

    uploadDocs() {
        for (const selectedFile of [(document.getElementById('ninFront') as HTMLInputElement).files[0]]) {
            console.log(selectedFile.name);
            const path = '/users/' + Date.now() + `${selectedFile.name}`;
            const task = this.afStorage.upload(path, selectedFile);
            this.iduploadPercent$ = task.percentageChanges();
            const ref = this.afStorage.ref(path);
            ref.put(selectedFile).then(() => {
                this.common.showLoader();
                ref.getDownloadURL().subscribe(url => this.userInfo.ninFront = url);
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });
        }
    }


    chooseNinBack() {
        document.getElementById('ninBack').click();
    }
    uploadNinBack() {
        for (const selectedFile of [(document.getElementById('ninBack') as HTMLInputElement).files[0]]) {
            console.log(selectedFile.name);
            const path = '/users/' + Date.now() + `${selectedFile.name}`;
            const task = this.afStorage.upload(path, selectedFile);
            this.idbackuploadPercent$ = task.percentageChanges();
            const ref = this.afStorage.ref(path);
            ref.put(selectedFile).then(() => {
                this.common.showLoader();
                ref.getDownloadURL().subscribe(url => this.userInfo.ninBack = url);
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });
        }
    }


    choosePermit() {
        document.getElementById('permit').click();
    }

    uploadPermit() {
        for (const selectedFile of [(document.getElementById('permit') as HTMLInputElement).files[0]]) {
            console.log(selectedFile.name);
            const path = '/users/' + Date.now() + `${selectedFile.name}`;
            const task = this.afStorage.upload(path, selectedFile);
            this.permituploadPercent$ = task.percentageChanges();
            const ref = this.afStorage.ref(path);

            this.common.showLoader();
            ref.put(selectedFile).then(() => {

                ref.getDownloadURL().subscribe(
                    url => this.userInfo.permitURL = url
                );
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });


        }
    }



    chooseVehicle() {
        document.getElementById('vehicle').click();
    }

    uploadVehicle() {
        for (const selectedFile4 of [(document.getElementById('vehicle') as HTMLInputElement).files[0]]) {
            console.log(selectedFile4.name);
            const path = '/users/' + Date.now() + `${selectedFile4.name}`;
            const task = this.afStorage.upload(path, selectedFile4);
            this.vehicleloadPercent$ = task.percentageChanges();
            const ref = this.afStorage.ref(path);
            ref.put(selectedFile4).then(() => {
                this.common.showLoader();
                ref.getDownloadURL().subscribe(url => this.userInfo.vehicleURL = url);
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });
        }
    }


}
