import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {take} from 'rxjs/operators'
import {CommonService} from '../services/common.service';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-withdraws',
    templateUrl: './withdraws.page.html',
    styleUrls: ['./withdraws.page.scss'],
})
export class WithdrawsPage implements OnInit {
    allrequests: any = [];

    constructor(private db: AngularFireDatabase,
                private http: HttpClient,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.getAllWithDraw()
    }


    getAllWithDraw() {
        this.db.list('transactions').snapshotChanges().subscribe((requests: any) => {
            if (requests != null) {
                let tmp = [];
                requests.forEach(request => {
                    tmp.push({key: request.key, ...request.payload.val()});
                    return false;
                });
                tmp.reverse();
                this.allrequests = tmp;
                console.log('driver_detail', this.allrequests);
            }
        })
    }

    send(txn) {
        this.db.object('drivers/' + txn.userId + '/balance').valueChanges().pipe(take(1)).subscribe((data: any) => {
            console.log(data);
            let balance = data;
            if (balance > txn.amount) {

                //  --- Contact Payment API Here ---
                try {
                    const url = "https://www.easypay.co.ug/api/";
                    const username = "37c8639b4912d708";
                    const passwd = "bb85e4bd9df13c96";

                    let smdata = {
                        "username": username,
                        "password": passwd,
                        "action": "mmpayout",
                        "amount": txn.amount,
                        "currency": "UGX",
                        "phone": "xxxxxx"
                    };

                    this.http.post(url, JSON.stringify(smdata), {})
                        .subscribe(response => {


                            // --- Update Drivers cashless Balance
                            this.db.object('drivers/' + txn.userId).update({balance: balance - txn.amount}).then(data => {
                                this.db.object('transactions/' + txn.key).update({status: 'SUCCESS'});
                            });

                            //     --- Record Transaction in withdraw Table ---
                            this.db.list('/withdraw_transactions').push({
                            //    --- Send Details will go here ---

                            }).then(() => {
                                console.log(`Money has been sent Successfully!`);
                                // this.playAudio();
                            }).catch(() => {
                                //    Error Handle
                                console.log('Failed to send the Money  Zybp15ZQ');
                            });

                        })

                } catch (e) {
                    this.commonService.showToast('an error occurred');
                    console.log(e);
                }

            }
            else {
                this.commonService.showToast("Insufficient Balance")
            }

        })

    }

    cancel(txnId) {
        this.db.object('transactions/' + txnId).update({status: 'CANCELED'});
    }

}
