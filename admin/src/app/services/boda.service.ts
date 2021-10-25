import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class BodaService {

    constructor(private db: AngularFireDatabase) {
    }

    getBodas() {
        return this.db.list('drivers', ref => ref.orderByChild('transporter').equalTo('Boda'));
    }

    getBoda(key) {
        return this.db.object('drivers/' + key);
    }

    deleteBoda(key) {
        return this.db.object('drivers/' + key).remove();
    }

    updateBoda(key, data) {
        return this.db.object('drivers/' + key).update(data);
    }

// filterBoda(region1) {
//     return this.db.list('drivers', ref => ref.orderByChild('region').equalTo(region1));
// }

    filterBoda(region1) {
        return this.db.list('drivers', ref => ref.orderByChild('transid').equalTo('Boda_' + region1));
    }


    getPhoneNumber(contacts) {
        return this.db.list('drivers', ref => ref.orderByChild('phoneNumber').equalTo(contacts));
    }

    getReferrals(reference) {
        return this.db.list('drivers', ref => ref.orderByChild('referenceid').equalTo(reference));
    }


}
