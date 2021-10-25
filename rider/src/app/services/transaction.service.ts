import { Injectable } from '@angular/core';
import {TRANSACTION_TYPE_DEPOSIT,TRANSACTION_TYPE_CASHLESS} from 'src/environments/environment.prod';
import {AuthService} from "./auth.service";
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  constructor(private authService: AuthService,
              private db: AngularFireDatabase
              ) { }

    depostMM(amount: number, balance: number, reference: string,
             telecomId: string, reason: string, transactionId: string,
             // phone: string, reason: string ,charge: string, date: string, TxID: string, currencyCode: string
    ) {
        let transporter = this.authService.getUserData();
        let userdetails = this.authService.getUser(transporter.uid);
        return this.db.list('customer_cashless/').push({
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
        });
    }

    getCashless() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('passengers/', ref => ref.orderByChild('userId').equalTo(user.uid));
    }

    getCashless1() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('customer_cashless/', ref => ref.orderByChild('userId').equalTo(user.uid));
    }

}
