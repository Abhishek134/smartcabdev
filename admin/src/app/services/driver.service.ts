import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class DriverService {


    constructor(private db: AngularFireDatabase) {
    }

    getDrivers() {

        return this.db.list('drivers');
    }

    getDriver(key) {
        return this.db.object('drivers/' + key);
    }

    deleteDriver(key) {
        return this.db.object('drivers/' + key).remove();
    }

    updateDriver(key, data) {
        return this.db.object('drivers/' + key).update(data);
    }

    getRefferals(serial) {
        return this.db.list('drivers', ref => ref.orderByChild('referenceid').equalTo(serial));
    }

    filterDrivers(region1) {
        // return this.db.list('drivers',
        //     ref => ref.orderByChild('group').equalTo('Boda')
        //         .orderByChild(region1).startAt(region1)
        // );
        return this.db.list('drivers', ref => ref.orderByChild('region').equalTo(region1));
    }


    getPhoneNumber(contacts) {
        return this.db.list('drivers', ref => ref.orderByChild('phoneNumber').equalTo(contacts));
    }

    getReferrals(reference) {
        return this.db.list('drivers', ref => ref.orderByChild('referenceid').equalTo(reference));
    }



}
