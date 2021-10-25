import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RiderService} from '../services/rider.service';
import {CommonService} from '../services/common.service';

@Component({
    selector: 'app-passengers',
    templateUrl: './passengers.page.html',
    styleUrls: ['./passengers.page.scss'],
})
export class PassengersPage implements OnInit {
    passengers: any = [];
    dtOptions: DataTables.Settings = {};
    showContent: any;

    constructor(private router: Router,
                private riderService: RiderService,
                private commonService: CommonService) {
    }

    ngOnInit() {

        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.riderService.getPassengers().snapshotChanges().subscribe((snapshot: any) => {
            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.passengers = tmp.reverse();
            }
        })
    }

    delete(key) {
        this.riderService.deletePassenger(key).then(() => this.commonService.showToast("Deleted")).catch(() => this.commonService.showToast("Something went wrong"))
    }


}
