import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
// import {Geolocation} from '@ionic-native/geolocation/ngx';
import { Geolocation} from "@ionic-native/geolocation/ngx";
// import {Geolocation} from "@ionic-native/geolocation";
import {PlaceService} from '../services/place.service';
import {TripsService} from "../services/trips.service";
import {DriverService} from '../services/driver.service';
import {Platform} from '@ionic/angular';
import {CommonService} from '../services/common.service';

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
    map: any;
    origin: any;
    startLatLng: any;
    destLatLng: any;
    drivers: any = [];
    dtOptions: DataTables.Settings = {};
    showContent: any;



    constructor(private afAuth: AngularFireAuth,
                private placeService: PlaceService,
                private geolocation: Geolocation,
                private tripService: TripsService,
                private driverService: DriverService,
                private platform: Platform,
                private common: CommonService,
                ) {
        this.ionViewDidEnter();
    }

    ngOnInit() {
        setTimeout(() => (this.showContent = true), 300);
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getDrivers();
    }
    ionViewDidEnter() {
        this.loadMap();
    }

    logout() {

        this.afAuth.auth.signOut();

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
                        // this.setOrigin();
                        // this.chRef.detectChanges();
                    } else {
                        // this.setOrigin();
                    }

                    // save locality

                    // let locality = this.placeService.setLocalityFromGeocoder(results);
                    // console.log('locality', locality);
                    // load list vehicles


                    // this.settingService.getPrices().valueChanges().subscribe((snapshot: any) => {
                    //     this.vehicles = [];
                    //     console.log('xxxx', snapshot);
                    //     let obj = snapshot[locality] ? snapshot[locality] : snapshot.default;
                    //     console.log('uuuu', obj);
                    //     this.currency = obj.currency;
                    //     this.tripService.setCurrency(this.currency);
                    //
                    //     // calculate price
                    //     Object.keys(obj.vehicles).forEach(id => {
                    //         obj.vehicles[id].id = id;
                    //         this.vehicles.push(obj.vehicles[id]);
                    //     });
                    //
                    //     console.log('MY VEHICLES', this.vehicles);
                    //
                    //     // calculate distance between origin adn destination
                    //     if (this.destination) {
                    //
                    //         directionsService.route(request, (result, status) => {
                    //
                    //             if (status == google.maps.DirectionsStatus.OK && result.routes.length != 0) {
                    //                 console.log(result);
                    //                 this.distance = result.routes[0].legs[0].distance.value / 1000;
                    //                 this.distanceText = result.routes[0].legs[0].distance.text;
                    //                 this.durationText = result.routes[0].legs[0].duration.text;
                    //                 console.log(this.distance);
                    //
                    //                 for (let i = 0; i < this.vehicles.length; i++) {
                    //
                    //                     // Calculating base fare if distance between base km
                    //                     if (this.distance <= parseInt(this.vehicles[i].base_km)) {
                    //                         var dis = this.distance;
                    //                         let string = "1";
                    //                         let num = parseInt(string);
                    //                         if ( dis < num) {
                    //                             // let  car_base =  parseInt(this.vehicles[i].base_low);
                    //                             let fee = (num * <any>parseFloat(this.vehicles[i].base_low).toFixed(0));
                    //                             // let fee = parseFloat((this.vehicles[i].base_fare));
                    //                             this.vehicles[i].fee = fee;
                    //                             this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (<any>parseFloat(this.vehicles[i].tax) / 100))).toFixed(0))
                    //                         }
                    //                         else {
                    //                             let fee =this.distance * <any>parseInt(this.vehicles[i].base_fare).toFixed(0);
                    //                             // let fee = parseFloat((this.vehicles[i].base_fare));
                    //                             this.vehicles[i].fee = fee;
                    //                             this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (parseInt(this.vehicles[i].tax) / 100))).toFixed(0))
                    //                         }
                    //
                    //                     }
                    //
                    //                     // Calculating base fare if distance above base km
                    //                     else if (this.distance > parseInt(this.vehicles[i].base_km)) {
                    //                         // // === CALCULATE AFTER 20 KM DISTANCE -- PEREZ NEW CODE ===
                    //                         let extraKm = this.distance - parseInt(this.vehicles[i].base_km);
                    //                         if (this.distance >= 20) {
                    //                             let fee = parseFloat(((parseInt(this.vehicles[i].base_km) * parseInt(this.vehicles[i].base_fare)) + (extraKm * parseInt(this.vehicles[i].per_km))) + (extraKm * parseInt(this.vehicles[i].per_20km)).toFixed(0));
                    //                             this.vehicles[i].fee = fee;
                    //                             this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (parseInt(this.vehicles[i].tax) / 100))).toFixed(0));
                    //                             console.log('WORKING HERE NOW 1')
                    //                         }
                    //                         else {
                    //                             let fee = parseFloat(((parseInt(this.vehicles[i].base_km) * parseInt(this.vehicles[i].base_fare)) + (extraKm * parseInt(this.vehicles[i].per_km))).toFixed(0));
                    //                             this.vehicles[i].fee = fee;
                    //                             this.vehicles[i].fee_taxed = parseFloat((fee + (fee * (parseInt(this.vehicles[i].tax) / 100))).toFixed(0));
                    //                             console.log('WORKING HERE NOW 2')
                    //                         }
                    //                     }
                    //
                    //                     if (this.vehicles[i].commission_type == 'percentage') {
                    //                         this.vehicles[i].commission = parseFloat((this.vehicles[i].fee * (parseInt(this.vehicles[i].commission_value) / 100)).toFixed(0));
                    //                     }
                    //                     else {
                    //                         this.vehicles[i].commission = parseFloat(parseFloat(this.vehicles[i].commission_value).toFixed(0));
                    //                     }
                    //                 }
                    //
                    //             } else {
                    //                 console.log("error");
                    //             }
                    //         });
                    //
                    //     }
                    //
                    //     // set first device as default
                    //     this.vehicles[0].active = true;
                    //     this.currentVehicle = this.vehicles[0];
                    //
                    //     this.locality = locality;
                    //     if (this.isTrackDriverEnabled)
                    //         this.trackDrivers();
                    // });
                }
            });

            // add destination to map
            // if (this.destination) {
            //     this.destLatLng = new google.maps.LatLng(this.destination.location.lat, this.destination.location.lng);
            //     var bounds = new google.maps.LatLngBounds();
            //     bounds.extend(this.startLatLng);
            //     bounds.extend(this.destLatLng);
            //
            //     mapx.fitBounds(bounds);
            //     var request = {
            //         origin: this.startLatLng,
            //         destination: this.destLatLng,
            //         travelMode: google.maps.TravelMode.DRIVING
            //     };
            //     directionsService.route(request, function (response, status) {
            //         if (status == google.maps.DirectionsStatus.OK) {
            //             console.log('hhh', response);
            //             directionsDisplay.setDirections(response);
            //             directionsDisplay.setMap(mapx);
            //         } else {
            //             console.log("error");
            //         }
            //     });
            // }
            // this.common.hideLoader();
        }).catch((error) => {
            // this.common.hideLoader();
            console.log('Error getting location', error);
        });
    }

    getDrivers() {
        this.common.showLoader();

        this.platform.ready().then(() => {
            this.driverService.getDrivers().snapshotChanges().subscribe((snapshot: any) => {

                if (snapshot != null) {
                    let tmp = [];
                    snapshot.forEach(snap => {
                        let data = {key: snap.key, ...snap.payload.val()};
                        tmp.push(data);
                        return false;
                    });
                    this.drivers = tmp.reverse();
                    this.common.hideLoader();
                }

            }, (err) => {
                console.log(err)
            });
        });
    }

}
