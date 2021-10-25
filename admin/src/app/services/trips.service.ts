import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Place} from "./place";

@Injectable({
  providedIn: 'root'
})
export class TripsService {
    private origin: any;

  constructor(private db: AngularFireDatabase) { }

  getTrips() {
    return this.db.list('trips');
  }
  
  getDriverTrips(key) {
    return this.db.list('trips', ref => ref.orderByChild('driverId').equalTo(key));
  }

  getRiderTrips(key) {
    return this.db.list('trips', ref => ref.orderByChild('passengerId').equalTo(key));
  }

  filterTrip(startTime, endTime) {
    return this.db.list('trips', ref => ref.orderByChild('createdAt').startAt(startTime).endAt(endTime));
  }

    finishedTrip() {
        return this.db.list('trips', ref => ref.orderByChild('status').equalTo('finished'));
    }

    canceledTrip() {
        return this.db.list('trips', ref => ref.orderByChild('status').equalTo('canceled'));
    }

    ongoingTrip() {
        return this.db.list('trips', ref => ref.orderByChild('status').equalTo('ongoing'));
    }

    setOrigin(vicinity, lat, lng) {
        let place = new Place(vicinity, lat, lng);
        return this.origin = place.getFormatted();
    }

    getOrigin() {
        return this.origin;
    }


}
