import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {take} from 'rxjs/operators'
import {AuthService} from '../services/auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {DriverService} from '../services/driver.service';
import {MenuController, AlertController} from '@ionic/angular';
import {TripService} from '../services/trip.service';
import {Router} from '@angular/router';
import {ChatService} from "../services/chat.service";
import {CommonService} from '../services/common.service';

import {
    AUDIO_PATH2,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';

import {__await} from "tslib";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    message: string = '';
    driver: any;
    trip: any = {};
    passenger: any = {};
    s;
    messages: object[] = [];

    constructor(private modalController: ModalController,
                private db: AngularFireDatabase,
                private authService: AuthService,
                private router: Router,
                private menuCtrl: MenuController,
                private driverService: DriverService,
                private commonService: CommonService,
                private tripService: TripService,
                private chatService: ChatService) {
        this.getAllMessages();
    }

    ngOnInit() {
    }

    closeModal() {
        this.modalController.dismiss();
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
                });

                //    --- get the passenger ---
                // this.trip = this.tripService.getCurrentTrip();
                this.db.object('passengers/' + this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
                    this.passenger = snapshot;
                    console.log('my trip', this.trip);
                    console.log('Passenger', this.passenger);
                    console.log('Passenger Mobile', this.passenger.phoneNumber);

                });
            }
        });

    }

    // Get Messages for Driver (PEREZ CODE)
     getAllMessages() {
        let tripId = this.tripService.getId();

         this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
            if (snapshot != null) {
                console.log(this.trip);
                this.trip = snapshot;
                console.log(this.trip);

                this.driverService.getDriver(this.trip.driverId).valueChanges().pipe(take(1)).subscribe(snap => {
                    console.log(snap);
                    this.driver = snap;

                    this.db.object('passengers/' + this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
                        this.passenger = snapshot;
                        console.log('Passenger xxx', this.passenger);
                        console.log('Passenger Mobile xxx', this.passenger.phoneNumber);

                        //== get the reference
                        // let referencex = 'opio@gmail.com_jane2@gmail.com';
                        let referencex = this.driver.email + '_' + this.passenger.email;
                        console.log('MY KK Protocol', referencex);
                         this.s = this.chatService.getDriverChat(referencex).valueChanges().subscribe(data => {
                            console.log('Perez observable xxx', data);
                            this.messages = data;
                            //this.onCreate();
                        });



                    });

                });

                //    --- get the passenger ---
                // this.trip = this.tripService.getCurrentTrip();

            }
        });







        //
        // if (this.authService.getUserData() != null) {
        //     // === Get Drivers ===
        //     this.driverService.getDriver(this.trip.driverId).valueChanges().subscribe((snapshot: any) => {
        //         if (snapshot != null) {
        //             this.driver = snapshot;
        //
        //             // === Get Passengers ===
        //             // this.trip = this.tripService.getCurrentTrip();
        //             this.db.object('passengers/' + this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
        //                 this.passenger = snapshot;
        //                 console.log('Passenger for Driver vvvv', this.passenger);
        //                 console.log('Passenger Mobile vvvv', this.passenger.phoneNumber);
        //
        //
        //                 //== get the reference
        //                 // let referencex = 'opio@gmail.com_jane2@gmail.com';
        //                 let referencex = this.driver.email + '_' + this.passenger.email;
        //                 console.log('MY KK Protocol', referencex);
        //                 this.s = this.chatService.getDriverChat(referencex).valueChanges().subscribe(data => {
        //                     console.log('Perez observable', data);
        //                     this.messages = data;
        //                 });
        //
        //             });
        //         }
        //     });
        // }

    }

    onCreate(){
        this.playAudio();
    }
    // === Set Values from Data ===
    sendChat() {
        //   ===  Store the data to Firebase ===
        this.db.list('/chat').push({
            message: this.message,
            createdAt: Date.now(),
            driverEmail: this.driver.email,
            driverImage: this.driver.photoURL,
            driverId: this.driver.uid,
            driverName: this.driver.name,
            passengerPhone: this.passenger.phoneNumber,
            passengerEmail: this.passenger.email,
            passengerPhoto: this.passenger.photoURL,
            referenceCode: this.driver.email + '_' + this.passenger.email,
            isDriver: 'no'
        }).then(() => {
            console.log('Data to be sent', this.message, Date.now(), this.driver.email, this.driver.photoURL, this.driver.uid, this.driver.name, +'passenger Email' +
                this.passenger.email, this.passenger.phoneNumber, this.passenger.photoURL);
            // this.playAudio();
            // this.commonService.showToast("Message Sent!");
            console.log(`Message Chat has been sent!`)
        }).catch(() => {
            //    Error Handle
            console.log('Failed to send Message!');
        });

    }



    playAudio() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH2);
            audio.load();
            audio.play();
        }
    }

}
