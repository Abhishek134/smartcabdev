import { Component, OnInit } from '@angular/core';
import { TripsService } from '../services/trips.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage implements OnInit {
  trips: any = [];
  today;
  startDate;
  endDate;
  constructor(private tripService: TripsService) {
    this.today = new Date().toISOString().substring(0, 10);
    this.startDate = this.today;
    this.endDate = this.today;
  }

  ngOnInit() {
    // this.getTrips()
    this.filter()
  }

  getTrips() {
    this.tripService.getTrips().valueChanges().subscribe(snap => {
      if (snap != null)
        this.trips = snap
    })
  }

  filter() {
    console.log(this.startDate, this.endDate);

    let startTimeStamp = new Date(this.startDate);
    startTimeStamp.setHours(0, 0, 0, 0);

    let endTimeStamp = new Date(this.endDate);
    endTimeStamp.setHours(23, 59, 59, 999);

    console.log(startTimeStamp.getTime(), endTimeStamp.getTime());

    this.tripService.filterTrip(startTimeStamp.getTime(), endTimeStamp.getTime()).valueChanges().subscribe(data => {
      this.trips = data;
    })
  }

}
