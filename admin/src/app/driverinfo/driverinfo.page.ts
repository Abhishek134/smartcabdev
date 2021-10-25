import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DriverService} from '../services/driver.service';
import {TripsService} from '../services/trips.service';
import {TransactionsService} from '../services/transactions.service';
import {AlertController} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {take} from 'rxjs/operators'
import {CommonService} from '../services/common.service';

@Component({
    selector: 'app-driverinfo',
    templateUrl: './driverinfo.page.html',
    styleUrls: ['./driverinfo.page.scss'],
})
export class DriverinfoPage implements OnInit {
    key: any;
    driver: any = {};
    referrals: any = {};
    riderid: any = {};
    tabs: any = 'carinfo';
    trips: any = [];
    records: any = [];
    currency: any = 'SHS';
    public ref = [];
    deposits: any = [];
    showContent: any;
    dtOptionsx: DataTables.Settings = {};

    constructor(private route: ActivatedRoute,
                private driverService: DriverService,
                private tripService: TripsService,
                private transactionService: TransactionsService,
                private alertCtrl: AlertController,
                private db: AngularFireDatabase,
                private commonService: CommonService,) {
        this.db.object('support/' + this.key).valueChanges().pipe(take(1)).subscribe((data: any) => {
            console.log('the message', data);
        });

        this.getDriverInfo()
    }

    ngOnInit() {
        setTimeout(() => (this.showContent = true), 200);
        this.dtOptionsx = {
            pagingType: 'full_numbers'
        };
        this.key = this.route.snapshot.paramMap.get('id');
        this.getDriverInfo();
        this.getDriverCashless();

    }

    getDriverInfo() {
        this.driverService.getDriver(this.key).valueChanges().subscribe(snapshot => {
            console.log(snapshot);
            if (snapshot != null)
                this.driver = snapshot;
            // console.log('driver: serial', snapshot);

            this.driverService.getDriver(this.key).valueChanges().pipe(take(1)).subscribe(snapsx => {
                console.log(snapshot);
                if (snapsx != null)
                    this.riderid = snapsx;
                console.log('driver referral', snapsx['serial']);
                let refid = snapsx['serial'];
                this.driverService.getRefferals(refid).valueChanges().subscribe(np => {
                    if (refid == this.riderid['referenceid']) {
                        this.referrals = np;
                        console.log('our referrals', this.referrals);
                    }

                })

            });


        })
    }

    getTrips() {
        this.tripService.getDriverTrips(this.key).valueChanges().subscribe((snap: any) => {
            console.log(snap);
            if (snap != null) {
                this.trips = snap;
            }
        })
    }


    getWallet() {
        this.transactionService.getDriverTransaction(this.key).valueChanges().subscribe((snap: any) => {
            console.log(snap);
            if (snap != null)
                this.records = snap
        })
    }

    getDriverCashless() {
        this.transactionService.getCashless(this.key).valueChanges().subscribe((snap: any) => {
            console.log(snap);
            if (snap != null) {
                this.deposits = snap;
                console.log('rider Deposits', this.deposits);
            }
        });
    }


    updateDriver() {
        // TASK TO DO
        console.log('Update driver info clicked!');

    }

    getMobileMoney() {
        console.log('ADD MOBILE MONEY TRANSACTIONS API');
    }

    changeStatus(key, status) {
        status = !status;
        this.driverService.updateDriver(key, {isApproved: status}).then(() => {
            this.commonService.showToast("Updated");
        }).catch(err => this.commonService.showToast("error"))
    }

    delete(key) {
        this.driverService.deleteDriver(key).then(data => {
            this.commonService.showToast("Deleted");
        }).catch(err => this.commonService.showLoader());
    }


}
