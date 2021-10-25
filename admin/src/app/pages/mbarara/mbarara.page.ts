import {Component, OnInit} from '@angular/core';
import {MbararaService} from "../../services/mbarara.service";
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-mbarara',
    templateUrl: './mbarara.page.html',
    styleUrls: ['./mbarara.page.scss'],
})
export class MbararaPage implements OnInit {
    mbarara_drivers: any = [];
    dtOptionsx: DataTables.Settings = {};
    showContent: any;


    constructor(private mbararaService: MbararaService,
                private common: CommonService,
                private router: Router) {
    }

    ngOnInit() {
        setTimeout(() => (this.showContent = true), 200);
        this.dtOptionsx = {
            pagingType: 'full_numbers'
        };

        this.getAllDrivers();

    }

    getAllDrivers() {
        this.mbararaService.getAllDrivers().snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.mbarara_drivers = tmp.reverse();
            }

        }, (err) => {
            console.log(err)
        });
    }

    delete(key) {
        this.mbararaService.deleteDriver(key).then(data => {
            this.common.showToast("Deleted");
        }).catch(err => this.common.showLoader());
    }

    changeStatus(key, status) {
        status = !status;
        this.mbararaService.updateDriver(key, {isApproved: status}).then(() => {
            this.common.showToast("Updated Successfully");
        }).catch(err => this.common.showToast("error"))
    }



}
