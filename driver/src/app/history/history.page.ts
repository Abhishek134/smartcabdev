import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TripService } from '../services/trip.service';
import { CURRENCY_SYMBOL } from '../../environments/environment.prod';
import {DriverService} from '../services/driver.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  // list of records
  public trips = [];
  fromDate: any;
  toDate: any;
  earning = 0;
  filter = 'today';
  today;
  allTrips = [];
  currency;
  public driver: any;

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private translate: TranslateService) {
    this.today = new Date().toISOString();
    this.fromDate = new Date().toISOString();
    this.toDate = new Date().toISOString();
    this.currency = CURRENCY_SYMBOL;

    // added by perez
    this.driverService.getDriver().valueChanges().subscribe(snapshot => {
      this.driver = snapshot;
    });

  }

  ngOnInit() {
    this.tripService.getTrips().valueChanges().subscribe(snapshot => {
      if (snapshot != null) {
        this.trips = snapshot;
        this.allTrips = this.trips;
        this.allTrips.reverse();
        this.calculateEarning();
      }
    });
  }

  calculateEarning() {
    let total = 0;
    this.trips.forEach(trip => {
      if (trip.commission != undefined && trip.commission != null)
        total += parseFloat(trip.commission)
    });
    this.earning = total;
  }

  applyFilter() {
    this.trips = this.allTrips;
    let fromDate = new Date(this.fromDate)
    fromDate.setHours(0, 0, 0, 0);
    let from = fromDate.getTime();

    let toDate = new Date(this.toDate);
    toDate.setHours(23, 59, 59, 999);
    let to = toDate.getTime();


    let tmp = this.trips.filter(item => item.createdAt >= from && item.createdAt <= to);
    this.trips = tmp;
    this.calculateEarning();
  }
  reset() {
    this.trips = this.allTrips;
    this.calculateEarning();
  }




}
