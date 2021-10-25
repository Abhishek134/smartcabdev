import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { TripsService } from '../services/trips.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-passengerinfo',
  templateUrl: './passengerinfo.page.html',
  styleUrls: ['./passengerinfo.page.scss'],
})
export class PassengerinfoPage implements OnInit {
  key: any;
  passenger: any = {};
  trips = [];
  tabs: any = 'basicinfo';

  constructor(
    private route: ActivatedRoute,
    private riderService: RiderService,
    private tripService: TripsService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.key = this.route.snapshot.paramMap.get('id');
    this.riderService.getPassenger(this.key).valueChanges().subscribe((snap) => {
      if (snap != null)
        this.passenger = snap;
    })
  }

  getTrips() {
    this.tripService.getRiderTrips(this.key).valueChanges().subscribe((snap) => {
      if (snap != null)
        this.trips = snap;
    })
  }

  updateUserInfo() {
    this.riderService.updatePassenger(this.key, this.passenger).then(data => {
      this.commonService.showToast("Updated");
    }).catch(err => console.log(err));
  }

}
