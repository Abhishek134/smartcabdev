import { Component, OnInit } from '@angular/core';
import {WalletService} from "../services/wallet.service";
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-driver-deposit',
  templateUrl: './driver-deposit.page.html',
  styleUrls: ['./driver-deposit.page.scss'],
})
export class DriverDepositPage implements OnInit {
    wallet: any = [];
    showContent: any;
    dtOptions: DataTables.Settings = {};

  constructor(private common: CommonService,
              private router: Router,
              private db: AngularFireDatabase,
              private driverWalletService: WalletService) { }

  ngOnInit() {
      setTimeout(() => (this.showContent = true), 250);
      this.dtOptions = {
          pagingType: 'full_numbers',
      };
      this.getDriverDeposits();
  }

    // === get customer deposits ===
    getDriverDeposits() {
        console.log('get driver deposits method called');
        this.driverWalletService
            .getDriverDeposit()
            .snapshotChanges()
            .subscribe(
                (snapshot: any) => {
                    if (snapshot != null) {
                        const tmp = [];
                        snapshot.forEach((snap) => {
                            const data = {key: snap.key, ...snap.payload.val()};
                            console.log('Drivers Wallet Trans', data);
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
