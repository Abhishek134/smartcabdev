import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable({
    providedIn: 'root'
})
export class MbararaService {

    constructor(private db: AngularFireDatabase) {
    }
    getAllDrivers()
    {
        return this.db.list('drivers', ref => ref.orderByChild('district').equalTo('Mbarara'));
    }

    deleteDriver(key) {
        return this.db.object('drivers/' + key).remove();
    }

    updateDriver(key, data) {
        return this.db.object('drivers/' + key).update(data);
    }

}


