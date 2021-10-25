import {Injectable} from '@angular/core';

import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from './auth.service';
import {
    TRIP_STATUS_WAITING,
    TRIP_STATUS_GOING,
    TRIP_STATUS_FINISHED,
    TRIP_STATUS_CANCELED,
    TRIP_PER_MINUTE_CHARGE,
} from "../../environments/environment.prod";
import {take} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {SettingService} from "./setting.service";

@Injectable({
    providedIn: 'root'
})
export class TripService {

    currentTrip: any;

    constructor(private db: AngularFireDatabase,
                private settingService: SettingService,
                private authService: AuthService,) {
    }

    // create trip from deal object
    createFromDeal(deal) {
        deal.status = TRIP_STATUS_WAITING;
        deal.otp = Math.floor(1000 + Math.random() * 9000);
        return this.db.list('trips').push(deal);
    }

    // pickup passenger
    pickUp(tripId) {
        this.db.object('trips/' + tripId).update({
            pickedUpAt: Date.now(),
            status: TRIP_STATUS_GOING
        });
    }

    // drop off
    dropOff(tripId) {

        this.db.object('trips/' + tripId).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
            console.log('test', snapshot);
            // insert if not exists
            if (snapshot !== null) {
                try {
                    console.log('Picked at', snapshot.pickedUpAt);
                    console.log('Dropped off at', Date.now());


                    const datepipe: DatePipe = new DatePipe('en-US');
                    // let start_time = datepipe.transform(snapshot.droppedOffAt, 'MMM/dd/yyyy HH:mm:ss');
                    // let end_time = datepipe.transform(snapshot.droppedOffAt, 'MMM/dd/yyyy HH:mm:ss');
                    let start_time = datepipe.transform(snapshot.pickedUpAt, 'h:mm ');
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
                    // == get the difference between expected end time and actual end time



                    // == Multiply the difference with 150

                    // == add the defference to the fee_taxed

                    this.db.object('trips/' + tripId).update({
                        droppedOffAt: Date.now(),
                        fee_taxed: (snapshot.fee_taxed + (actual_minutes_used - snapshot.pickedUpAt) * TRIP_PER_MINUTE_CHARGE),
                        status: TRIP_STATUS_FINISHED
                    })
                }
                catch(err) {
                    console.log(err);
                }


            } else {
                // update
            }
        });
    }

    cancel(tripId) {
        this.db.object('trips/' + tripId).update({
            droppedOffAt: Date.now(),
            status: TRIP_STATUS_CANCELED
        })
    }

    setCurrentTrip(tripId) {
        return this.db.object('trips/' + tripId).snapshotChanges().pipe(take(1)).subscribe((snapshot: any) => {
            this.db.object('trips/' + tripId).update({key: tripId});
            console.log(snapshot);
            if (snapshot != null) {
                this.currentTrip = {key: snapshot.key, ...snapshot.payload.val()};
            }
        });
    }

    getCurrentTrip() {
        return this.currentTrip;
    }

    getTripStatus(tripId) {
        return this.db.object('trips/' + tripId);
    }

    getPassenger(passengerId) {
        return this.db.object('passengers/' + passengerId);
    }

    // get driver's trip
    getTrips() {
        let user = this.authService.getUserData();
        return this.db.list('trips', ref => ref.orderByChild('driverId').equalTo(user.uid));
    }
}
