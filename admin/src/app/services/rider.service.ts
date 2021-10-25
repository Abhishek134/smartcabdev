import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RiderService {

  constructor(private db: AngularFireDatabase) { }

  getPassengers() {
    return this.db.list('passengers');
  }

  getPassenger(key) {
    return this.db.object('passengers/' + key);
  }

  deletePassenger(key) {
    return this.db.object('passengers/' + key).remove();
  }

  updatePassenger(key, data) {
    return this.db.object('passengers/' + key).update(data);
  }
}
