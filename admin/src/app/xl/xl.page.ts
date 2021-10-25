import {Component, OnInit} from '@angular/core';
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {OnlyDriverService} from "../services/only-driver.service";

@Component({
    selector: 'app-xl',
    templateUrl: './xl.page.html',
    styleUrls: ['./xl.page.scss'],
})
export class XlPage implements OnInit {

    showContent: any;
    drivers: any = [];
    dtOptions: DataTables.Settings = {};

    constructor(private onlyDriverService: OnlyDriverService,
                private common: CommonService,
                private router: Router,
                private db: AngularFireDatabase) {
    }

    ngOnInit() {
        setTimeout(() => (this.showContent = true), 200);
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
        this.getDrivers();
    }

    getDrivers() {
        this.onlyDriverService
            .getXlDrivers()
            .snapshotChanges()
            .subscribe(
                (snapshot: any) => {
                    if (snapshot != null) {
                        const tmp = [];
                        snapshot.forEach((snap) => {
                            const data = {key: snap.key, ...snap.payload.val()};
                            console.log('smart go XL ', data);
                            tmp.push(data);
                            return false;
                        });
                        this.drivers = tmp.reverse();
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    delete(key) {
        if (confirm('Are you sure to delete this record?')) {
            this.onlyDriverService
                .deleteCarDriver(key)
                .then((data) => {
                    this.common.showToast('Driver Deleted');
                })
                .catch((err) => this.common.showLoader());
        } else {
            console.log('Not Deleted!');
        }
    }

    changeStatus(key, status) {
        status = !status;
        this.onlyDriverService
            .updateCarDriver(key, {isApproved: status})
            .then(() => {
                this.common.showToast('Driver Updated');
            })
            .catch((err) => this.common.showToast('error'));
    }


}
