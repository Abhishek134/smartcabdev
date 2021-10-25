import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    constructor(private db: AngularFireDatabase) {
    }


    getCustomerDeposit() {
        return this.db.list('customer_cashless');
    }

    getDriverDeposit() {
        // return this.db.list('cashlessm');
        return this.db.list('driver_cashless');
    }


    getCommission() {
        return this.db.list('cash_commission_paybacks');
    }

}
