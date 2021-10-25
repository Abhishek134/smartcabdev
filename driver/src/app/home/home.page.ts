import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {DriverService} from '../services/driver.service';
import {AlertController, MenuController} from '@ionic/angular';
import {DealService} from '../services/deal.service';
import {PlaceService} from '../services/place.service';
import {TranslateService} from '@ngx-translate/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Storage} from '@ionic/storage';
import {CommonService} from '../services/common.service';
import {DepositService} from "../services/deposit.service";
// import { Vibration} from "@ionic-native/vibration";
import {BackgroundMode} from '@ionic-native/background-mode/ngx';

import {
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    AUDIO_PATH55,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';
// import {Vibration} from "@ionic-native/vibration/ngx";


declare var google: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    map: any;
    driver: any = {};
    deposits: any = {};
    deal: any;
    dealSubscription: any;
    isDriverAvailable = false;
    positionTracking: any;
    dealStatus = false;
    dealAlert: any;
    today;
    old_date;
    paymentDate;
    currentDate;
    old_user;
    dsuser;
    public job: any;
    public remainingTime = DEAL_TIMEOUT;

    constructor(private driverService: DriverService,
                private alertCtrl: AlertController,
                private dealService: DealService,
                private authService: AuthService,
                private placeService: PlaceService,
                private geolocation: Geolocation,
                private translate: TranslateService,
                private router: Router,
                private storage: Storage,
                private menuCtrl: MenuController,
                private common: CommonService,
                // private vibration: Vibration,
                private depositService: DepositService,
                private backgroundMode: BackgroundMode,

                ) {

    }

    ngOnInit() {
        if (!this.isDriverAvailable) {
            clearInterval(this.positionTracking);
        }
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(true);

        if (!this.isDriverAvailable) {
            clearInterval(this.positionTracking);
        }

        if (this.authService.getUserData() != null) {
            this.driverService.getDriver().valueChanges().subscribe((snapshot: any) => {
                if (snapshot != null) {
                    console.log(snapshot);
                    this.driver = snapshot;
                }
            });
            this.storage.get('iondriver_settings').then((res: any) => {
                if (res != null && res != undefined) {
                    let data = JSON.parse(res);
                    this.isDriverAvailable = data.alwaysOn;
                }
            }).catch(err => console.log(err));

            this.changeAvailability();

        }
        else {
            this.router.navigateByUrl('/login');
        }

    }

    loadMap(lat, lng) {
        let latLng = new google.maps.LatLng(lat, lng);
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
        });
        //--- perez new code ---

        // const icon ={
        //     url: '/assets/icon/u.png',
        //     scaleSize: new google.maps.size(50, 50)
        // };


        // ====================================

        new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable:true,
            title: 'YOUR CURRENT LOCATION',
            icon: '/assets/icon/u.png',
        });

        // =====================================

        // const contentString =
        //     '<div id="content">' +
        //     '<div id="siteNotice">' +
        //     "</div>" +
        //     '<h1 id="firstHeading" class="firstHeading">SMART CABS DRIVER</h1>' +
        //     '<div id="bodyContent">' +
        //     "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>" +
        //     "Heritage Site.</p>" +
        //     '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        //     "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
        //     "(last visited June 22, 2009).</p>" +
        //     "</div>" +
        //     "</div>";
        //
        // const infowindow = new google.maps.InfoWindow({
        //     content: contentString,
        // });
        //
        // this.map.marker.addListener("click", () => {
        //     infowindow.open({
        //         anchor: marker,
        //         map,
        //         shouldFocus: false,
        //     });
        // });


    }


    // --- New Method  ---
    changeAvailability() {
        clearInterval(this.positionTracking);
        console.log(' ', this.isDriverAvailable);
        if (this.isDriverAvailable == true) {
            // get current location
            if (parseInt(this.driver.commission_balance) < 20000) {
                console.log('commission is less than 20000');
                this.playAudio4();
                this.geolocation.getCurrentPosition().then((resp) => {
                    let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
                    let geocoder = new google.maps.Geocoder();

                    this.loadMap(resp.coords.latitude, resp.coords.longitude);
                    // find address from lat lng
                    geocoder.geocode({'latLng': latLng}, (results, status) => {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log('', results);
                            // save locality
                            let locality = this.placeService.setLocalityFromGeocoder(results);
                            console.log('locality', locality);

                            // start tracking
                            this.positionTracking = setInterval(() => {
                                // check for driver object, if it did not complete profile, stop updating location
                                if (!this.driver || !this.driver.type) {
                                    return;
                                }

                                if (this.isDriverAvailable) {
                                    // === perez ===
                                    // setInterval(console.log('xxxxx'), 3000);


                                    // Periodic update after particular time intrvel
                                    this.geolocation.getCurrentPosition().then((resp) => {
                                        console.log('', resp);
                                        this.driverService.updatePosition(this.driver.uid, this.driver.type, locality, resp.coords.latitude, resp.coords.longitude, this.driver.rating, this.driver.first_name);

                                    }, err => {
                                        console.log('', err);
                                    });

                                }

                            }, POSITION_INTERVAL);


                            this.watchDeals();
                        }
                    });
                }, err => {
                    console.log(err);
                });
            } else {
                console.log('Please Pay your date to continue');
                if (!this.driver.commission_balance) {
                    this.driver.commission_balance = 0;
                    this.common.showAlert(`Please pay the outstanding debt amount of UGX ${ this.driver.commission_balance}/= to use our application`);
                } else {
                    let xp = this.driver.commission_balance;
                    this.common.showAlert(`Please pay the outstanding debt amount of UGX ${ xp}/= to use our application`);
                }
                this.router.navigateByUrl('/payment');
            }


        }
        else {
            clearInterval(this.positionTracking);
            if (this.dealSubscription) {
                // unsubscribe when leave this page
                this.dealSubscription.unsubscribe();
            }
        }

    }

    ionViewWillLeave() {
        if (this.dealSubscription) {
            clearInterval(this.positionTracking);
            this.dealSubscription.unsubscribe();
            // this.common.showToast('Please Check Balance!');
        }
    }

    // count down
    countDown() {
        let interval = setInterval(() => {
            this.remainingTime--;
            this.dealAlert.subHeader = 'Auto Reject in ' + this.remainingTime + ' sec';
            if (this.remainingTime == 0) {
                clearInterval(interval);
                this.cancelDeal();
                this.remainingTime = DEAL_TIMEOUT;
            }
        }, 1000);
        this.confirmJob();
    }

    cancelDeal() {
        console.log("close");
        this.dealStatus = false;
        this.dealAlert.dismiss();
        this.dealService.removeDeal(this.driver.uid);
    }


    range(n) {
        return new Array(Math.round(n));
    }

    // confirm a job
    confirmJob() {
        console.log("confirm");
        // add vibration logic
        // this.vibrate();

        this.backgroundMode.enable();
        this.backgroundMode.disableWebViewOptimizations();
        this.backgroundMode.wakeUp();
        this.backgroundMode.moveToForeground();
        this.backgroundMode.overrideBackButton();
        this.backgroundMode.unlock();


        let message = "<b>From:</b> (" + this.job.origin.distance + "km)<br/>" + this.job.origin.vicinity + "<br/><b>To:</b>(" + this.job.destination.distance + "km)<br>" + this.job.destination.vicinity + "<br> <p>Your Commission: <h5>" + this.job.currency + this.job.commission + "</h5></p>";


        this.alertCtrl.create({
            header: 'New Request',
            message: message,
            cssClass: 'customAlert',
            buttons: [
                {
                    text: 'Reject',
                    role: 'cancel',
                    handler: () => {
                        console.log('Disagree clicked');
                        this.dealStatus = false;
                        this.dealService.removeDeal(this.driver.uid);
                    }
                },
                {
                    text: 'Accept',
                    handler: () => {
                        this.dealStatus = false;
                        this.dealService.acceptDeal(this.driver.uid, this.deal).then(() => {
                            this.router.navigateByUrl('pickup');
                        });
                    }
                }
            ]
        }).then(res => {
            this.dealAlert = res;
            this.dealAlert.present();
        });
        this.playAudio55();
    }

    // vibrate(){
    // //    --- This is Vibration Logic ---
    //     this.vibration.vibrate([1000, 500, 3000, 1000, 5000]);
    // }

    // listen to deals
    watchDeals() {
        // listen to deals
        this.dealSubscription = this.dealService.getDeal(this.driver.uid).valueChanges().subscribe((snapshot: any) => {
            if (snapshot != null || snapshot != undefined) {
                this.deal = snapshot;
                if (snapshot.status == DEAL_STATUS_PENDING) {
                    // if deal expired
                    if (snapshot.createdAt < (Date.now() - DEAL_TIMEOUT * 1000)) {
                        return this.dealService.removeDeal(this.driver.uid);
                    }
                    this.dealStatus = true;
                    console.log(this.dealStatus);


                    this.job = snapshot;

                    this.geolocation.getCurrentPosition().then((resp) => {
                        //resp.coords.longitude
                        this.job.origin.distance = this.placeService.calcCrow(resp.coords.latitude, resp.coords.longitude, this.job.origin.location.lat, this.job.origin.location.lng).toFixed(0);
                        this.job.destination.distance = this.placeService.calcCrow(resp.coords.latitude, resp.coords.longitude, this.job.destination.location.lat, this.job.destination.location.lng).toFixed(0);
                        this.countDown();
                    }, err => {
                        console.log(err);
                    });
                }
            }
        });
    }
    //
    // playAudio() {
    //     if (PLAY_AUDIO_ON_REQUEST == true) {
    //         let audio = new Audio(AUDIO_PATH);
    //         audio.play();
    //     }
    // }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigateByUrl('/login/', {replaceUrl: true})
        });
    }

    playAudio() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH3);
            audio.load();
            audio.play();
        }}

    playAudio5() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH5);
            audio.load();
            audio.play();
        }}

    playAudio4() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH4);
            audio.load();
            audio.play();
        }}


    playAudio55() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH55);
            audio.load();
            audio.play();
        }}

    sideBarOpen(){
        this.playAudio();
    }
}
