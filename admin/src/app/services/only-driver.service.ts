import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class OnlyDriverService {

    constructor(private db: AngularFireDatabase) {
    }

    getCarDrivers() {
        // return this.db.list('drivers', ref => ref.orderByChild('transporter').equalTo('XL'));
        return this.db.list('drivers');
    }

    getCarDriver(key) {
        return this.db.object('drivers/' + key);
    }

    deleteCarDriver(key) {
        return this.db.object('drivers/' + key).remove();
    }

    updateCarDriver(key, data) {
        return this.db.object('drivers/' + key).update(data);
    }


    // pending  add XL
    filterCarDrivers(category) {
        return this.db.list('drivers', ref => ref.orderByChild('transid').equalTo('XL_' + category));
    }

    filterMiniDrivers(category) {
        return this.db.list('drivers', ref => ref.orderByChild('transid').equalTo('cheap_cars_' + category));
    }

    filterXlDrivers(category) {
        return this.db.list('drivers', ref => ref.orderByChild('transid').equalTo('XL_' + category));
    }


    // pending add MINI ----

    getMiniDrivers() {
        return this.db.list('drivers', ref => ref.orderByChild('type').equalTo('cheap_cars'));
    }

    getXlDrivers() {
        return this.db.list('drivers', ref => ref.orderByChild('transporter').equalTo('XL'));
    }



}
