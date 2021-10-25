import {Component, OnInit} from '@angular/core';
import {BodaService} from "../services/boda.service";
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-bikes',
    templateUrl: './bikes.page.html',
    styleUrls: ['./bikes.page.scss'],
})
export class BikesPage implements OnInit {

    bikes: any = [];
    dtOptionsx: DataTables.Settings = {};
    showContent: any;
    category = '';
    contacts = '';
    reference = '';

    constructor(private bodaService: BodaService,
                private common: CommonService,
                private router: Router) {
    }

    ngOnInit() {
        setTimeout(() => (this.showContent = true), 200);
        this.dtOptionsx = {
            pagingType: 'full_numbers'
        };

        this.getBodas();
    }


    getBodas() {

        this.common.showLoader();
        this.bodaService.getBodas().snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.bikes = tmp.reverse();
                this.common.hideLoader();
            }

        }, (err) => {
            console.log(err)
        });
    }


    delete(key) {
        this.bodaService.deleteBoda(key).then(data => {
            this.common.showToast("Deleted");
        }).catch(err => this.common.showLoader());
    }

    changeStatus(key, status) {
        status = !status;
        this.bodaService.updateBoda(key, {isApproved: status}).then(() => {
            this.common.showToast("Updated");
        }).catch(err => this.common.showToast("error"))
    }

    filter() {
        this.common.showLoader();
        this.bodaService.filterBoda(this.category).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.bikes = tmp.reverse();
            }

        }, (err) => {
            console.log(err);
        });

        this.common.hideLoader();

    }

    filterReference() {
        this.common.showLoader();
        this.bodaService.getReferrals(this.reference).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.bikes = tmp.reverse();
                console.log('Biker Contacts', this.bikes);
            }

        }, (err) => {
            console.log(err);
        });
        this.common.hideLoader();

    }

    filterContacts() {
        this.common.showLoader();
        this.bodaService.getPhoneNumber(this.contacts).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.bikes = tmp.reverse();
                console.log('Driver Contacts', this.bikes);

            }

        }, (err) => {
            console.log(err);
        });
        this.common.hideLoader();

    }





}
