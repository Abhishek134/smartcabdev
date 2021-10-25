import {Component, OnInit} from '@angular/core';
import {OnlyDriverService} from "../services/only-driver.service";
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {MiniService} from "../services/mini.service";
import {DriverService} from '../services/driver.service';

@Component({
    selector: 'app-mini',
    templateUrl: './mini.page.html',
    styleUrls: ['./mini.page.scss'],
})
export class MiniPage implements OnInit {
    showContent: any;
    dtOptions: DataTables.Settings = {};
    drivers: any = [];
    category = '';

    constructor(private onlyDriverService: OnlyDriverService,
                private common: CommonService,
                private driverService: DriverService,
                private router: Router,
                private miniService: MiniService,
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
            .getMiniDrivers()
            .snapshotChanges()
            .subscribe(
                (snapshot: any) => {
                    if (snapshot != null) {
                        const tmp = [];
                        snapshot.forEach((snap) => {
                            const data = {key: snap.key, ...snap.payload.val()};
                            console.log('smart go Mini ', data);
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

    filter() {
        this.common.showLoader();
        this.miniService.filterMini(this.category).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.drivers = tmp.reverse();
            }

        }, (err) => {
            console.log(err);
        });

        this.common.hideLoader();

    }

    changeStatus(key, status) {
        status = !status;
        this.driverService.updateDriver(key, {isApproved: status}).then(() => {
            this.common.showToast("Updated");
        }).catch(err => this.common.showToast("error"))
    }

    delete(key) {
        this.driverService.deleteDriver(key).then(data => {
            this.common.showToast("Deleted");
        }).catch(err => this.common.showLoader());
    }



}
