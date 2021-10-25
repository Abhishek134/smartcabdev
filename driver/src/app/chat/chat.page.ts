import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {take} from 'rxjs/operators'
import {TripService} from '../services/trip.service';
import {CommonService} from '../services/common.service';
import {AuthService} from '../services/auth.service';
import {DriverService} from '../services/driver.service';
import {ChatService} from "../services/chat.service";

import {
    AUDIO_PATH2,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    trip: any = {};
    passenger: any = {};
    driver: any = {};
    message: string = '';
    s;
    messages: object[] = [];

    constructor(private modalController: ModalController,
                private common: CommonService,
                private driverService: DriverService,
                private db: AngularFireDatabase,
                private authService: AuthService,
                private tripService: TripService,
                private chatService: ChatService) {
        this.getAllMessages();
    }

    ngOnInit() {
    }

    // Get Messages for Driver (PEREZ CODE)
    getAllMessages() {
        if (this.authService.getUserData() != null) {
            // === Get Drivers ===
            this.driverService.getDriver().valueChanges().subscribe((snapshot: any) => {
                if (snapshot != null) {
                    this.driver = snapshot;
                    // === Get Passengers ===
                    this.trip = this.tripService.getCurrentTrip();
                    this.db.object('passengers/' + this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
                        this.passenger = snapshot;
                        console.log('Passenger for Driver vvvv', this.passenger);
                        console.log('Passenger Mobile vvvv', this.passenger.phoneNumber);
                        //== get the reference
                        // let referencex = 'opio@gmail.com_jane2@gmail.com';
                        let referencex = this.driver.email + '_' + this.passenger.email;
                        console.log('MY KK Protocol', referencex);
                        this.s = this.chatService.getDriverChat(referencex).valueChanges().subscribe(data => {
                            console.log('Perez observable', data);
                            this.messages = data;
                            this.onCreate();
                        });

                    });
                }
            });
        }

    }


    onCreate() {
        this.playAudio();
    }

    closeModal() {
        this.modalController.dismiss();
    }


    ionViewDidEnter() {
        // --- Get the driver ---
        if (this.authService.getUserData() != null) {
            this.driverService.getDriver().valueChanges().subscribe((snapshot: any) => {
                if (snapshot != null) {
                    this.driver = snapshot;
                }
            });
            this.trip = this.tripService.getCurrentTrip();
            this.db.object('passengers/' + this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
                this.passenger = snapshot;
                console.log('Passenger for Driver', this.passenger);
                console.log('Passenger Mobile', this.passenger.phoneNumber);
            });
        }
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
            isDriver: 'yes'
        }).then(() => {
            console.log('Data to be sent', this.message, Date.now(), this.driver.email, this.driver.photoURL, this.driver.uid, this.driver.name, +'passenger Email' +
                this.passenger.email, this.passenger.phoneNumber, this.passenger.photoURL);
            console.log(`Message Chat has been sent!`);
            this.playAudio();
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



