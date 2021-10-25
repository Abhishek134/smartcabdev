import { Component, OnInit } from '@angular/core';
import {WalletService} from "../services/wallet.service";
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-customer-deposit',
  templateUrl: './customer-deposit.page.html',
  styleUrls: ['./customer-deposit.page.scss'],
})
export class CustomerDepositPage implements OnInit {
    wallet: any = [];
    showContent: any;
    dtOptions: DataTables.Settings = {};

  constructor(private common: CommonService,
              private router: Router,
              private db: AngularFireDatabase,
              private customerWalletService: WalletService) { }

  ngOnInit() {
      setTimeout(() => (this.showContent = true), 250);
      this.dtOptions = {
          pagingType: 'full_numbers',
      };
      this.getCustomerDeposits();
  }

    // === get customer deposits ===
    getCustomerDeposits() {
        console.log('get customer deposits method called');
        this.customerWalletService
            .getCustomerDeposit()
            .snapshotChanges()
            .subscribe(
                (snapshot: any) => {
                    if (snapshot != null) {
                        const tmp = [];
                        snapshot.forEach((snap) => {
                            const data = {key: snap.key, ...snap.payload.val()};
                            console.log('Customer Wallet Trans', data);
                            tmp.push(data);
                            return false;
                        });
                        this.wallet = tmp.reverse();
                    }
                },
                (err) => {
                    console.log(err);
                }
            );


    }


}
