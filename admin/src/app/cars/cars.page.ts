import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {CommonService} from '../services/common.service';

@Component({
    selector: 'app-cars',
    templateUrl: './cars.page.html',
    styleUrls: ['./cars.page.scss'],
})
export class CarsPage implements OnInit {
    cars: any = [];
    newCar: any = {name: '', icon: '', type: '', price: 0, enable: true};
    carTemp: any = [];
    currency: any;
    isEdit = false;


    constructor(private db: AngularFireDatabase,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.getCarInfo();
    }

    getCarInfo() {
        this.commonService.showLoader();
        this.db.object('master_settings/prices/default/currency').valueChanges().subscribe(data => {
            console.log(data);
            this.currency = data;
        });

        this.db.list("master_settings/prices/default/vehicles/").snapshotChanges().subscribe((snap: any) => {
            let tmp = [];
            snap.forEach(car => {
                tmp.push({key: car.key, ...car.payload.val()});
                return false;
            });
            this.cars = tmp;
            this.commonService.hideLoader();
        });
    }


    updateCurrency() {
        this.db.object('master_settings/prices/default/currency').set(this.currency).then(() => {
            this.commonService.showToast("Updated");
        });
    }




}
