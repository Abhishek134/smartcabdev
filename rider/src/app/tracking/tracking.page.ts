import {Component, OnInit} from '@angular/core';
import {
    POSITION_INTERVAL,
    TRIP_STATUS_GOING,
    SOS,
    TRIP_STATUS_CANCELED,
    TRIP_STATUS_FINISHED,
    environment
} from 'src/environments/environment.prod';
import {DriverService} from '../services/driver.service';
import {MenuController, AlertController} from '@ionic/angular';
import {TripService} from '../services/trip.service';
import {PlaceService} from '../services/place.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {SMS} from '@ionic-native/sms/ngx';
import {ModalController} from '@ionic/angular'
import {ChatPage} from '../chat/chat.page'
import { DatePipe } from '@angular/common';
import {SettingService} from '../services/setting.service';

declare var google: any;

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.page.html',
    styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {


    driver: any;
    map: any;
    trip: any = {};
    driverTracking: any;
    marker: any;
    tripStatus: any;
    sos: any;
    alertCnt: any = 0;
    rate: any = 5;
    chat: any;
    url: any;

    constructor(private driverService: DriverService,
                private tripService: TripService,
                private placeService: PlaceService,
                private router: Router,
                private menuCtrl: MenuController,
                private afdb: AngularFireDatabase,
                private alertCtrl: AlertController,
                private sms: SMS,
                private settingService: SettingService,
                private modalController: ModalController) {
        this.sos = SOS;
    }

    ngOnInit() {
    }

    openModal() {
        console.log('Opening Modal');
        this.modalController.create({component: ChatPage}).then((modalElement) => {
            modalElement.present();
        });
    }


    ionViewDidEnter() {
        this.menuCtrl.enable(true);
        let tripId = this.tripService.getId();

        this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
            if (snapshot != null) {
                console.log(this.trip);
                this.trip = snapshot;
                console.log(this.trip);

                this.driverService.getDriver(this.trip.driverId).valueChanges().pipe(take(1)).subscribe(snap => {
                    console.log(snap);

                    this.driver = snap;
                    this.watchTrip(tripId);
                    // init map
                    this.loadMap();
                })
            }
        });
    }

    ionViewWillLeave() {
        clearInterval(this.driverTracking);
    }

    watchTrip(tripId) {
        this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
            this.tripStatus = snapshot.status;
            if (this.tripStatus == TRIP_STATUS_CANCELED && this.tripStatus == TRIP_STATUS_FINISHED) {
                clearInterval(this.driverTracking);


                this.router.navigateByUrl('/home');
            }
        });
    }

    showRateCard() {
        console.log('Picked at', this.trip.pickedUpAt);
        console.log('Dropped off at', Date.now());
        const datepipe: DatePipe = new DatePipe('en-US');
        let start_time = datepipe.transform(this.trip.pickedUpAt, 'h:mm ');
        let end_time = datepipe.transform(Date.now(), 'h:mm ');
        console.log('start_time', start_time);
        console.log('end_time', end_time);

        // == Get the minutes from start and end
        var a = start_time.split(':');
        var startminutes = (+a[0])*60 + (+a[1]);

        // interested in end
        var b = end_time.split(':');
        var end_minutes = (+b[0])*60 + (+b[1]);

        // get actual minutes it took from start to finish
        var actual_minutes_used =(end_minutes - startminutes);
        console.log('Actual Trip Time Used', actual_minutes_used);

        console.log('Actual Google map minutes', this.tripService.getDuration());
        // == get the difference between expected end time and actual end time

        var google_time = this.tripService.getDuration();

        try{
            if (actual_minutes_used > google_time) {
                var extra_minx = actual_minutes_used - google_time;
                var calculate_money = extra_minx*150;
                this.trip.final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100)) + calculate_money;
            }
            else{
                this.trip.final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100));
            }
        } catch(err) {
            this.trip.final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100));
        }

        console.log('SHOW PICKED AT TIME', this.trip.pickedUpAt);

        this.router.navigate(['rating'], {
            queryParams: {
                trip: JSON.stringify(this.trip),
                driver: JSON.stringify(this.driver)
            }
        });
    }




    loadMap() {

        console.log("load Map calling");
        let latLng = new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
            fullscreenControl: false
        };

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        // if (this.driver.brand == 'car') {
        //     this.marker = new google.maps.Marker({
        //         map: this.map,
        //         position: latLng,
        //         title: 'Diquela Coding ...',
        //         icon: {
        //             url: 'assets/perez/sedan.png',
        //             size: new google.maps.Size(50, 50),
        //             origin: new google.maps.Point(0, 0),
        //             anchor: new google.maps.Point(16, 16),
        //             scaledSize: new google.maps.Size(32, 32)
        //         },
        //     });
        // }
        if (this.driver.type == 'boda') {
            this.marker = new google.maps.Marker({
                map: this.map,
                position: latLng,
                title: 'Diquela Coding ...',
                icon: {
                    // url: 'assets/img/map-boda.png',
                    url: 'assets/img/perez/boda.png',
                    size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16),
                    scaledSize: new google.maps.Size(32, 32)
                },
            });
        } else {
            this.marker = new google.maps.Marker({
                map: this.map,
                position: latLng,
                title: 'Diquela Coding ...',
                icon: {
                    url: 'assets/img/perez/sedan.png',
                    size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16),
                    scaledSize: new google.maps.Size(32, 32)
                },
            });
        }


        this.trackDriver();
    }

    // make array with range is n
    range(n) {
        return new Array(Math.round(n));
    }

    trackDriver() {
        // this.showDriverOnMap();

        this.driverTracking = setInterval(() => {
            this.marker.setMap(null);
            this.showDriverOnMap();
        }, POSITION_INTERVAL);

        console.log(POSITION_INTERVAL);
    }

    cancelTrip() {
        this.alertCtrl.create({
            message: "Are you sure want to cancel the trip",
            buttons: [{
                text: "Yes",
                handler: () => {
                    this.tripService.cancelTrip(this.trip.key).then(data => {
                        console.log(data);
                        this.router.navigateByUrl('/home');
                    });
                }
            }, {
                text: "No"
            }]
        }).then(res => res.present());

    }

    // show user on map
    showDriverOnMap() {
        // get user's position
        this.driverService.getDriverPosition(
            this.placeService.getLocality(),
            this.driver.type,
            this.driver.uid
        ).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
            // create or update
            console.log(snapshot);
            let latLng = new google.maps.LatLng(snapshot.lat, snapshot.lng);

            if (this.tripStatus == TRIP_STATUS_GOING) {
                console.log(this.tripStatus);
                this.map.setCenter(latLng);
            }
            // show vehicle to map

            let vtype = this.driver.type;
            if (vtype == 'boda') {
                this.url = 'assets/img/perez/boda.png';
            }
            else {
                // this.url = 'assets/img/map-suv.png';
                this.url = 'assets/img/perez/sedan.png';
            }
            this.marker = new google.maps.Marker({
                map: this.map,
                position: latLng,
                icon: {
                    url: this.url,
                    size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(16, 16),
                    scaledSize: new google.maps.Size(32, 32)
                },
            });
            console.log('perez trip', this.trip);

        });
    }

    // sendMessage() {
    //     this.sms.send(this.driver.phoneNumber,  'Hello its me on SmartCabs, Where have you reached?');
    // }


}
