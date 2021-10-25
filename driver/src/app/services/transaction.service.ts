import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from './auth.service';
import {TRANSACTION_TYPE_WITHDRAW,} from 'src/environments/environment.prod';
import {TRANSACTION_TYPE_DEPOSIT,TRANSACTION_TYPE_CASHLESS} from 'src/environments/environment.prod';

import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private db: AngularFireDatabase, private authService: AuthService,
                private http: HTTP) {
    }

    getTransactions() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('transactions', ref => ref.orderByChild('userId').equalTo(user.uid));
    }

    widthDraw(amount: number, balance: number) {
        let user = this.authService.getUserData();
        console.log('the user data', user);
        return this.db.list('transactions/').push({
            userId: user.uid,
            name: user.displayName,
            email: user.email,
            amount: amount,
            createdAt: Date.now(),
            type: TRANSACTION_TYPE_WITHDRAW,
            status: 'PENDING'
        });
    }

    // perez code
    // --- Pay to use for the day
    getPayments() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('deposits', ref => ref.orderByChild('userId').equalTo(user.uid));
    }


    getComissions() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('driver_transaction', ref => ref.orderByChild('driverId').equalTo(user.uid));
    }



    // Top up wallet with mobile money
    getCashless() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('driver_cashless', ref => ref.orderByChild('userId').equalTo(user.uid));
    }

    // --- Making a payment here ---
    makePayment(amount: number, balance: number) {
        let transporter = this.authService.getUserData();
        let userdetails = this.authService.getUser(transporter.uid);
        return this.db.list('deposits/').push({
            userId: transporter.uid,
            name: transporter.displayName,
            amount: amount,
            createAt: Date.now(),
            type: TRANSACTION_TYPE_DEPOSIT,
            status: 'PAID',
            paymentMethod: 'mobile_money'
        });
    }

    // --- Making a payment here ---
    // kd.telecomId, kd.success, kd.transactionId, kd.phone,
    // kd.reason, kd.charge, kd.date, kd.TxID, kd.currencyCode

    depostMM(amount: number, balance: number, reference: string,
             telecomId: string, reason: string, transactionId: string,
             // phone: string, reason: string ,charge: string, date: string, TxID: string, currencyCode: string
    ) {
        let transporter = this.authService.getUserData();
        let userdetails = this.authService.getUser(transporter.uid);
        //xxxxx
        // return this.db.list('cashlessm/').push({
        return this.db.list('driver_cashless/').push({
                userId: transporter.uid,
                name: transporter.displayName,
                amount: amount,
                new_balance: balance,
                createAt: Date.now(),
                type: TRANSACTION_TYPE_CASHLESS,
                status: 'DEPOSITED',
                paymentMethod: 'mobile_money',
                reference: reference,
                telecomId: telecomId,
                reason: reason,
                transactionId: transactionId,
                // phone: phone,
                // reason: reason,
                // charge: charge,
                // date:date,
                // TxID:TxID,
                // currencyCode: currencyCode
            })
        };



    payDebtTransactions(amount: number, new_commission_balance: number, paymentMethod: string, wallet_balance: string, telecomId: string) {
        let transporter = this.authService.getUserData();
        let userdetails = this.authService.getUser(transporter.uid);
        return this.db.list('cash_commission_paybacks/').push({
            userId: transporter.uid,
            name: transporter.displayName,
            amount: amount,
            paymentMethod: paymentMethod,
            commission_balance: new_commission_balance,
            wallet_balance: wallet_balance,
            telecomId: telecomId,
            createAt: Date.now()
        })

    }


    getComissionPayBacks() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('cash_commission_paybacks', ref => ref.orderByChild('userId').equalTo(user.uid));
    }

}
