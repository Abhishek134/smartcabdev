import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CUSTOMER_CARE, CURRENCY_SYMBOL} from '../../environments/environment.prod';
import {AuthService} from '../services/auth.service';
import {Platform} from '@ionic/angular';
import {SettingService} from '../services/setting.service';
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {concatMap, last, take} from 'rxjs/operators';
import {Observable, pipe} from "rxjs";


@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    user: any = {};
    currency: any;
    support = CUSTOMER_CARE;
    tripCount = 0;
    totalEarning = 0;
    rating: any = 5;
    types: Array<any> = [];
    tabs: any = 'profile';

    step: any = 1;

    genders = {
        male: 'MALE',
        female: 'FEMALE'
    };

    identicards = {
        nin: 'National ID',
        passport: 'Passport',
        driver_licence: 'Driver Licence'
    };

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


    constructor(private authService: AuthService,
                private settingService: SettingService,
                private common: CommonService,
                private platform: Platform,
                private translate: TranslateService,
                private router: Router,
                private afStorage: AngularFireStorage,) {
    }

    ngOnInit() {
        // this.user = this.authService.getUser(this.authService.getUserData().uid);
        this.common.showLoader();
        this.authService.getUser(this.authService.getUserData().uid).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
            console.log(snapshot);
            this.user = snapshot;
            this.common.hideLoader();
        });

        this.currency = CURRENCY_SYMBOL;
        this.settingService.getVehicleType().pipe(take(1)).subscribe((snapshot: any) => {
            if (snapshot === null) {
                this.settingService.getDefaultVehicleType().pipe(take(1)).subscribe((snapshot: any) => {
                    console.log(snapshot);
                    this.types = Object.keys(snapshot).map(function (key) {
                        return snapshot[key];
                    });
                });
            } else {
                this.types = Object.keys(snapshot).map(function (key) {
                    return snapshot[key];
                });
            }
        });
        console.log(this.user);
    }

    save() {
        console.log(this.user);
        this.authService.getUser(this.user.uid).update(this.user).then(data => {
            this.common.showToast('Your Profile has been updated successfully');
            this.router.navigateByUrl('/home');
        });
    }


    chooseFile() {
        document.getElementById('avatar').click();
    }

    upload() {
        // Create a root reference
        this.common.showLoader();

        for (const selectedFile of [(document.getElementById('avatar') as HTMLInputElement).files[0]]) {
            const path = '/users/' + Date.now() + `_${selectedFile.name}`;
            const ref = this.afStorage.ref(path);
            ref.put(selectedFile).then(() => {
                ref.getDownloadURL().subscribe(data => {
                    this.user.photoURL = data;
                });
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });

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
                ref.getDownloadURL().subscribe(url => this.user.photo2URL = url);
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
                ref.getDownloadURL().subscribe(url => this.user.ninFront = url);
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
                ref.getDownloadURL().subscribe(url => this.user.ninBack = url);
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
                    url => this.user.permitURL = url
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
                ref.getDownloadURL().subscribe(url => this.user.vehicleURL = url);
                this.common.hideLoader();
            }).catch(err => {
                this.common.hideLoader();
                console.log(err);
            });
        }
    }





    logout() {
        this.authService.logout().then(() => this.router.navigateByUrl('/login', {
            skipLocationChange: true,
            replaceUrl: true
        }));
    }

    nextPage() {
        this.step = this.step + 1;
    }

    previousPage() {
        this.step = this.step - 1;
    }

}
