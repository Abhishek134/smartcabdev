import {Component, OnInit} from '@angular/core';
import {TripsService} from "../services/trips.service";

@Component({
    selector: 'app-cancelledtrips',
    templateUrl: './cancelledtrips.page.html',
    styleUrls: ['./cancelledtrips.page.scss'],
})
export class CancelledtripsPage implements OnInit {
    trips: any = [];

    constructor(private tripService: TripsService) {

    }

    ngOnInit() {
        this.getTrips();
    }

    getTrips() {
        this.tripService.canceledTrip().valueChanges().subscribe(snap => {
            if (snap != null) {
                this.trips = snap;
                console.log('Canceled Trips', this.trips);
            }

        });

    }

}
