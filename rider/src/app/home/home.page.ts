import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {PlaceService} from '../services/place.service';
import {SettingService} from '../services/setting.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth.service';
import {DealService} from '../services/deal.service';
import {DriverService} from '../services/driver.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {TripService} from '../services/trip.service';
import {AlertController, MenuController, Platform} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {
    DEAL_STATUS_PENDING,
    DEAL_STATUS_ACCEPTED,
    POSITION_INTERVAL,
    SHOW_VEHICLES_WITHIN,
    VEHICLE_LAST_ACTIVE_LIMIT
} from 'src/environments/environment.prod';

import {
    AUDIO_PATH2,
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    AUDIO_PATH6,
    PLAY_AUDIO_ON_REQUEST,
} from 'src/environments/environment.prod';
import {take} from 'rxjs/operators';
import {CommonService} from '../services/common.service';
import * as firebase from 'firebase';
import {Vibration} from '@ionic-native/vibration/ngx';

declare var google: any;
declare var Stripe: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    mapId = Math.random() + 'map';
    mapHeight: number = 480;
    showModalBg: boolean = false;
    showVehicles: boolean = false;
    // vehicles: any = [];
    vehicles: any;
    currentVehicle: any;
    note: any = '';
    promocode: any = '';
    map: any;
    origin: any;
    destination: any;
    distance: number = 0;
    duration: number = 0;
    currency: string;
    locality: any;
    paymentMethod: string = 'cash';
    activeDrivers: Array<any> = [];
    driverMarkers: Array<any> = [];
    driverTracking: any;
    locateDriver: any = false;
    drivers: any;
    user = {};
    isTrackDriverEnabled = true;
    discount: any = 0;
    startLatLng: any;
    destLatLng: any;
    directionsService: any;
    directionsDisplay: any;
    bounds: any;
    cardNumber: any;
    distanceText: any = '';
    durationText: any = '';

    subscribe: any;

    constructor(private router: Router,
                private alertCtrl: AlertController,
                private placeService: PlaceService,
                private geolocation: Geolocation,
                private chRef: ChangeDetectorRef,
                private settingService: SettingService,
                private tripService: TripService,
                private driverService: DriverService,
                private afAuth: AngularFireAuth,
                private authService: AuthService,
                private translate: TranslateService,
                private dealService: DealService,
                private common: CommonService,
                private menuCtrl: MenuController,
                private vibration: Vibration,
                public platform: Platform) {

        this.ionViewDidEnter();
        this.platform.ready().then(() => {
            this.subscribe = this.platform.backButton.subscribeWithPriority(666666, () => {
                if (window.confirm("Do you want to Minimize Smart Cabs?")) {
                    navigator["app"].exitApp()
                }
            })
        })
    }

    // ionViewDidLoad() {
    //     this.afAuth.authState
    //         .subscribe(auth => {
    //             if (auth) {
    //                 // Redirect to logged in page
    //                 this.user = this.authService.getUserData();
    //                 this.origin = this.tripService.getOrigin();
    //                 this.destination = this.tripService.getDestination();
    //                 this.loadMap();
    //             } else {
    //                 // Redirect to logged out page
    //             }
    //         });
    // }

    ionViewDidEnter() {
        // this.common.showLoader();
        this.menuCtrl.enable(true);
        this.afAuth.authState.subscribe(authData => {
            if (authData) {
                this.user = this.authService.getUserData();
            }
        });
        console.log("calling");
        this.origin = this.tripService.getOrigin();
        this.destination = this.tripService.getDestination();
        this.loadMap();
        // this.common.hideLoader();
    }

    ngOnInit() {
        console.log("calling");
    }

    ionViewWillLeave() {
        clearInterval(this.driverTracking);
    }

    // get current payment method from service
    getPaymentMethod() {
        this.paymentMethod = this.tripService.getPaymentMethod();
        return this.paymentMethod;
    }

    choosePaymentMethod1() {
        this.alertCtrl.create({
            header: "Choose Payments",
            inputs: [
                {type: 'radio', label: "Cash", value: 'cash'},
                {type: 'radio', label: "Wallet", value: 'wallet'},
                // {type: 'radio', label: "Card", value: 'card'}
            ],
            buttons: [{
                text: "Cancel"
            }, {
                text: "Choose",
                handler: (data) => {
                    console.log(data);
                    if (data == 'card') {
                        this.authService.getCardSetting().valueChanges().pipe(take(1)).subscribe((res: any) => {
                            if (res != null) {
                                this.tripService.setPaymentMethod(data);
                                this.paymentMethod = data;

                                const exp = res.exp.split('/');
                                Stripe.card.createToken({
                                    number: res.number,
                                    exp_month: exp[0],
                                    exp_year: exp[1],
                                    cvc: res.cvv
                                }, (status: number, response: any) => {
                                    if (status == 200) {
                                        console.log("Card Ready");
                                        this.authService.updateCardSetting(res.number, res.exp, res.cvv, response.id);
                                    } else {
                                        this.common.showToast(response.error.message);
                                    }
                                });
                            }
                            else
                                this.common.showAlert("Invalid Card")
                        })
                    }
                    else if (data == 'cash') {
                        this.paymentMethod = data;
                        this.tripService.setPaymentMethod(data);
                    }
                    else if (data == 'wallet') {
                        this.paymentMethod = data;
                        this.tripService.setPaymentMethod(data);
                    }
                }
            }]
        }).then(res => res.present());
    }

    // toggle active vehicle
    chooseVehicle(index) {
        for (var i = 0; i < this.vehicles.length; i++) {
            this.vehicles[i].active = (i == index);
            // choose this vehicle type
            this.playButtonSound1();

            if (i == index) {
                this.tripService.setVehicle(this.vehicles[i]);
                this.currentVehicle = this.vehicles[i];
            }
        }
        // start tracking new driver type
        this.trackDrivers();
        this.toggleVehicles();
    }

    loadMap() {
        // this.common.showLoader("Loading..");
        // get current location
        return this.geolocation.getCurrentPosition().then((resp) => {

            if (this.origin) this.startLatLng = new google.maps.LatLng(this.origin.location.lat, this.origin.location.lng);
            else this.startLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

            let directionsDisplay;
            let directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer();

            this.map = new google.maps.Map(document.getElementById(this.mapId), {
                zoom: 15,
                center: this.startLatLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                zoomControl: false,
                streetViewControl: false,
                fullscreenControl: false,

            });

            let mapx = this.map;
            directionsDisplay.setMap(mapx);

            // find map center address
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': this.map.getCenter()}, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (!this.origin) {
                        // set map center as origin
                        this.origin = this.placeService.formatAddress(results[0]);
                        this.tripService.setOrigin(this.origin.vicinity, this.origin.location.lat, this.origin.location.lng);
                        this.setOrigin();
                        this.chRef.detectChanges();
                    } else {
                        this.setOrigin();
                    }

                    // save locality
                    let locality = this.placeService.setLocalityFromGeocoder(results);
                    console.log('locality', locality);
                    // load list vehicles
                    this.settingService.getPrices().valueChanges().subscribe((snapshot: any) => {
                        this.vehicles = [];
                        console.log('xxxx', snapshot);
                        let obj = snapshot[locality] ? snapshot[locality] : snapshot.default;
                        console.log('uuuu', obj);
                        this.currency = obj.currency;
                        this.tripService.setCurrency(this.currency);

                        // calculate price
                        Object.keys(obj.vehicles).forEach(id => {
                            obj.vehicles[id].id = id;
                            this.vehicles.push(obj.vehicles[id]);
                        });

                        console.log('MY VEHICLES', this.vehicles);

                        // calculate distance between origin adn destination
                        if (this.destination) {

                            directionsService.route(request, (result, status) => {

                                if (status == google.maps.DirectionsStatus.OK && result.routes.length != 0) {
                                    console.log(result);
                                    this.distance = result.routes[0].legs[0].distance.value / 1000;
                                    this.distanceText = result.routes[0].legs[0].distance.text;
                                    this.durationText = result.routes[0].legs[0].duration.text;
                                    console.log(this.distance);

                                    for (let i = 0; i < this.vehicles.length; i++) {

                                        // Calculating base fare if distance between base km
                                        if (this.distance <= parseInt(this.vehicles[i].base_km)) {
                                            var dis = this.distance;
                                            let string = "1";
                                            let num = parseInt(string);
                                            if ( dis < num) {
                                                // let  car_base =  parseInt(this.vehicles[i].base_low);
                                                let fee = (num * <any>parseFloat(this.vehicles[i].base_low).toFixed(0));
                                                // let fee = parseFloat((this.vehicles[i].base_fare));
                                                this.vehicles[i].fee = fee;
                                                this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (<any>parseFloat(this.vehicles[i].tax) / 100))).toFixed(0))
                                            }
                                            else {
                                                let fee =this.distance * <any>parseInt(this.vehicles[i].base_fare).toFixed(0);
                                                // let fee = parseFloat((this.vehicles[i].base_fare));
                                                this.vehicles[i].fee = fee;
                                                this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (parseInt(this.vehicles[i].tax) / 100))).toFixed(0))
                                            }

                                        }

                                        // Calculating base fare if distance above base km
                                        else if (this.distance > parseInt(this.vehicles[i].base_km)) {
                                            // // === CALCULATE AFTER 20 KM DISTANCE -- PEREZ NEW CODE ===
                                            let extraKm = this.distance - parseInt(this.vehicles[i].base_km);
                                            if (this.distance >= 20) {
                                                let fee = parseFloat(((parseInt(this.vehicles[i].base_km) * parseInt(this.vehicles[i].base_fare)) + (extraKm * parseInt(this.vehicles[i].per_km))) + (extraKm * parseInt(this.vehicles[i].per_20km)).toFixed(0));
                                                this.vehicles[i].fee = fee;
                                                this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (parseInt(this.vehicles[i].tax) / 100))).toFixed(0));
                                                console.log('WORKING HERE NOW 1')
                                            }
                                            else {
                                                let fee = parseFloat(((parseInt(this.vehicles[i].base_km) * parseInt(this.vehicles[i].base_fare)) + (extraKm * parseInt(this.vehicles[i].per_km))).toFixed(0));
                                                this.vehicles[i].fee = fee;
                                                this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (parseInt(this.vehicles[i].tax) / 100))).toFixed(0));
                                                console.log('WORKING HERE NOW 2')
                                            }
                                        }

                                        if (this.vehicles[i].commission_type == 'percentage') {
                                            this.vehicles[i].commission = parseFloat((this.vehicles[i].fee * (parseInt(this.vehicles[i].commission_value) / 100)).toFixed(0));
                                        }
                                        else {
                                            this.vehicles[i].commission = parseFloat(parseFloat(this.vehicles[i].commission_value).toFixed(0));
                                        }
                                    }

                                } else {
                                    console.log("error");
                                }
                            });

                        }

                        // set first device as default
                        this.vehicles[0].active = true;
                        this.currentVehicle = this.vehicles[0];

                        this.locality = locality;
                        if (this.isTrackDriverEnabled)
                            this.trackDrivers();
                    });
                }
            });

            // add destination to map
            if (this.destination) {
                this.destLatLng = new google.maps.LatLng(this.destination.location.lat, this.destination.location.lng);
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(this.startLatLng);
                bounds.extend(this.destLatLng);

                mapx.fitBounds(bounds);
                var request = {
                    origin: this.startLatLng,
                    destination: this.destLatLng,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        console.log('hhh', response);
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap(mapx);
                    } else {
                        console.log("error");
                    }
                });
            }
            // this.common.hideLoader();
        }).catch((error) => {
            // this.common.hideLoader();
            console.log('Error getting location', error);
        });
    }

    showPromoPopup() {
        this.alertCtrl.create({
            header: 'Enter Promo code',
            inputs: [
                {name: 'promocode', placeholder: 'Enter Promo Code'}
            ],
            buttons: [
                {text: 'Cancel'},
                {
                    text: 'Apply',
                    handler: (data) => {
                        console.log(data.promocode);
                        //verifying promocode
                        firebase.database().ref('promocodes').orderByChild("code").equalTo(data.promocode).once('value', promocodes => {
                            console.log(promocodes.val());
                            let tmp: any = [];
                            promocodes.forEach(promo => {
                                tmp.push({key: promo.key, ...promo.val()});
                                return false;
                            });
                            tmp = tmp[0];
                            console.log(tmp);
                            if (promocodes.val() != null || promocodes.val() != undefined) {
                                this.promocode = tmp.code;
                                this.discount = tmp.discount;
                                this.tripService.setPromo(tmp.code);
                                this.tripService.setDiscount(tmp.discount);
                                console.log('promo applied', tmp.code, tmp.discount);
                                this.common.showToast("Promo Applied");
                            }
                            else {
                                this.common.showToast("Invalid Promocode");
                            }
                        }, err => console.log(err));
                    }
                }
            ]
        }).then(prompt => prompt.present());

    }


    // Show note popup when click to 'Notes to user'
    showNotePopup() {
        this.alertCtrl.create({
            header: 'Notes to user',
            message: "",
            inputs: [
                {name: 'note', placeholder: 'Note'},
            ],
            buttons: [
                {text: 'Cancel'},
                {
                    text: 'Save',
                    handler: data => {
                        this.note = data;
                        this.tripService.setNote(data);
                        console.log('Saved clicked');
                    }
                }
            ]
        }).then(prompt => prompt.present());

    };

    // go to next view when the 'Book' button is clicked
    book() {
        this.locateDriver = true;
        // store detail
        this.tripService.setAvailableDrivers(this.activeDrivers);
        this.tripService.setDistance(this.distance);
        // perez code
        this.tripService.setDuration(this.durationText);

        this.tripService.setFee(this.currentVehicle.fee);
        this.tripService.setRawFee(this.currentVehicle.fee);
        this.tripService.setFeeTaxed(this.currentVehicle.fee_taxed);
        this.tripService.setIcon(this.currentVehicle.icon);
        this.tripService.setNote(this.note);
        this.tripService.setPromo(this.promocode);
        this.tripService.setDiscount(this.discount);
        this.tripService.setTax(this.currentVehicle.tax);
        this.tripService.setCommissionType(this.currentVehicle.commission_type);
        this.tripService.setCommissionValue(this.currentVehicle.commission_value);
        this.tripService.setCommission(this.currentVehicle.commission);
        // this.tripService.setPaymentMethod('');
        this.drivers = this.tripService.getAvailableDrivers();
        // sort by driver distance and rating
        this.drivers = this.dealService.sortDriversList(this.drivers);

        //Applying discount
        console.log(this.tripService.getDiscount());
        if (this.tripService.getDiscount() != 0) {
            console.log(this.tripService.getFee());

            let feeAfterDiscount = this.tripService.getFee() - (this.tripService.getFee() * this.tripService.getDiscount() / 100);
            this.tripService.setFee(parseFloat(feeAfterDiscount.toFixed(0)));

            console.log(feeAfterDiscount.toFixed(0));

            let feeTaxedAfterDiscount = feeAfterDiscount + (feeAfterDiscount * (this.tripService.getTax() / 100));

            this.tripService.setFeeTaxed(parseFloat(feeTaxedAfterDiscount.toFixed(0)));
            console.log(feeTaxedAfterDiscount.toFixed(0));
        }

        if (this.drivers) {
            this.makeDeal(0);
        }

    }

    makeDeal(index) {
        let driver = this.drivers[index];
        let dealAccepted = false;

        if (driver) {
            driver.status = 'Bidding';
            this.dealService.getDriverDeal(driver.key).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
                // if user is available
                console.log(snapshot);
                if (snapshot == null) {
                    // create a record
                    console.log(snapshot);

                    this.dealService.makeDeal(
                        driver.key,
                        this.tripService.getOrigin(),
                        this.tripService.getDestination(),
                        this.tripService.getDistance(),
                        this.tripService.getFee(),
                        this.tripService.getCurrency(),
                        this.tripService.getNote(),
                        this.tripService.getPaymentMethod(),
                        this.tripService.getPromo(),
                        this.tripService.getDiscount(),
                        this.tripService.getTax(),
                        this.tripService.getFeeTaxed(),
                        this.tripService.getRawFee(),
                        this.tripService.getCommissionType(),
                        this.tripService.getCommissionValue(),
                        this.tripService.getCommission(),
                    ).then(() => {
                        let sub = this.dealService.getDriverDeal(driver.key).valueChanges().subscribe((snap: any) => {
                            // if record doesn't exist or is accepted
                            if (snap === null || snap.status != DEAL_STATUS_PENDING) {
                                sub.unsubscribe();

                                // if deal has been cancelled
                                if (snap === null) {
                                    this.nextDriver(index);
                                } else if (snap.status == DEAL_STATUS_ACCEPTED) {
                                    // if deal is accepted
                                    console.log('accepted', snap.tripId);
                                    dealAccepted = true;
                                    this.locateDriver = false;

                                    this.drivers = [];
                                    this.tripService.setId(snap.tripId);
                                    // go to user page
                                    this.router.navigateByUrl('tracking', this.durationText);
                                }
                            }
                        });
                    });
                } else {
                    this.nextDriver(index);
                }
            });
        } else {
            // show error & try again button
            console.log('No user found');
            this.locateDriver = false;
            this.common.showAlert("No Active Driver Found or Driver is too far Away");
        }
    }

    // make deal to next driver
    nextDriver(index) {
        this.drivers.splice(index, 1);
        this.makeDeal(index);
    }

    // choose origin place
    chooseOrigin() {

        this.router.navigate(['map'], {
            queryParams: {
                type: 'origin'
            }
        });
    }

    // choose destination place
    chooseDestination() {
        this.router.navigate(['map'], {
            queryParams: {
                type: 'destination'
            }
        });
    }

    choosePaymentMethod() {
        this.router.navigateByUrl('/payments');
    }

    // add origin marker to map
    setOrigin() {
        // add origin and destination marker
        let latLng = new google.maps.LatLng(this.origin.location.lat, this.origin.location.lng);
        let startMarker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,

            // icon:{
            //     path: 'm 12,2.4000002 c -2.7802903,0 -5.9650002,1.5099999 -5.9650002,5.8299998 0,1.74375 1.1549213,3.264465 2.3551945,4.025812 1.2002732,0.761348 2.4458987,0.763328 2.6273057,2.474813 L 12,24 12.9825,14.68 c 0.179732,-1.704939 1.425357,-1.665423 2.626049,-2.424188 C 16.809241,11.497047 17.965,9.94 17.965,8.23 17.965,3.9100001 14.78029,2.4000002 12,2.4000002 Z',
            //     fillColor: '#00FF00',
            //     fillOpacity: 1.0,
            //     strokeColor: '#000000',
            //     strokeWeight: 1,
            //     scale: 2,
            //     anchor: new google.maps.Point(12, 24),
            // },
        });
        startMarker.setMap(this.map);
        if (this.destination)
            startMarker.setMap(null);
        // set map center to origin address
        this.map.setCenter(latLng);
    }

    // show or hide vehicles
    toggleVehicles() {
        this.showVehicles = !this.showVehicles;
        this.showModalBg = (this.showVehicles == true);
    }

    // track drivers
    trackDrivers() {
        this.showDriverOnMap(this.locality);
        clearInterval(this.driverTracking);

        this.driverTracking = setInterval(() => {
            this.showDriverOnMap(this.locality);
        }, POSITION_INTERVAL);

        console.log(POSITION_INTERVAL);
    }

    // show drivers on map
    showDriverOnMap(locality) {
        console.log(locality);
        console.log(this.currentVehicle.id);
        // get active drivers

        this.driverService.getActiveDriver(locality, this.currentVehicle.id).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
            console.log(snapshot);
            // clear vehicles
            this.clearDrivers();

            // only show near vehicle
            snapshot.forEach(vehicle => {
                console.log('ffg', vehicle);
                // only show vehicle which has last active < 30 secs & distance < 5km
                let distance = this.placeService.calcCrow(vehicle.lat, vehicle.lng, this.origin.location.lat, this.origin.location.lng);
                console.log(distance);
                console.log("distance:" + distance + " Last Active: " + (Date.now() - vehicle.last_active));
                // checking last active time and distance
                if (distance < SHOW_VEHICLES_WITHIN && Date.now() - vehicle.last_active < VEHICLE_LAST_ACTIVE_LIMIT) {
                    // create or update
                    let latLng = new google.maps.LatLng(vehicle.lat, vehicle.lng);

                    let marker = new google.maps.Marker({
                        map: this.map,
                        position: latLng,
                        icon: {
                            url: this.currentVehicle.map_icon,
                            size: new google.maps.Size(32, 32),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(16, 16),
                            scaledSize: new google.maps.Size(30, 32)
                        },
                    });

                    // add vehicle and marker to the list
                    vehicle.distance = distance;
                    console.log(marker);
                    this.driverMarkers.push(marker);
                    this.activeDrivers.push(vehicle);
                } else {
                    console.log('This vehicle is too far or not available');
                }

            });
        });
    }

    // clear expired drivers on the map
    clearDrivers() {
        this.activeDrivers = [];
        this.driverMarkers.forEach((vehicle) => {
            vehicle.setMap(null);
        });
    }


    vibrate() {
        console.log('vibration is activated');
        this.vibration.vibrate(2000);
    }


    playButtonSound() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH3);
            audio.load();
            audio.play();
        }
    }
    playButtonSound1() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH3);
            audio.load();
            audio.play();
        }
    }

}
