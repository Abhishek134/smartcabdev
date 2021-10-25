import {Component, OnInit} from '@angular/core';
import {TripsService} from '../services/trips.service';

@Component({
    selector: 'app-completedtrips',
    templateUrl: './completedtrips.page.html',
    styleUrls: ['./completedtrips.page.scss'],
})
export class CompletedtripsPage implements OnInit {
    trips: any = [];

    constructor(private tripService: TripsService) {
    }

    ngOnInit() {
        this.getTrips();
    }

    getTrips() {
        this.tripService.finishedTrip().valueChanges().subscribe(snap => {
            if (snap != null) {
                this.trips = snap;
                console.log('Completed Trips', this.trips);
            }

        });
    }

}
