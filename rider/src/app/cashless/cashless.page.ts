import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {Platform} from '@ionic/angular';
import {HttpClient} from "@angular/common/http";
import {AlertController} from '@ionic/angular';
import {TransactionService} from "../services/transaction.service";
import {AngularFireDatabase} from '@angular/fire/database';

import {
    AUDIO_PATH,
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';


@Component({
    selector: 'app-cashless',
    templateUrl: './cashless.page.html',
    styleUrls: ['./cashless.page.scss'],
})
export class CashlessPage implements OnInit {
    passenger: any = {};
    balance: 0.00;
    public deposits: any;
    public transtate = [];
    public depositsHistory: any;


    constructor(private authService: AuthService,
                private platform: Platform,
                private common: CommonService,
                private router: Router,
                private afStorage: AngularFireStorage,
                private http: HttpClient,
                private alertCtrl: AlertController,
                private transactionService: TransactionService,
                private db: AngularFireDatabase,
                ) {
        transactionService.getCashless().valueChanges().subscribe(snapshot => {
            if (snapshot != null) {
                this.deposits = snapshot.reverse();
                console.log('mydeposits', this.deposits);

                // let record;
                // for (record in this.deposits) {
                //     this.transtate = this.deposits[record];
                //     console.log('Customer payments', this.transtate[0]);
                // }
            }
        });

        transactionService.getCashless1().valueChanges().subscribe(snapshot => {
            if (snapshot != null) {
                this.depositsHistory = snapshot.reverse();
                console.log('mydeposits', this.deposits);

                let record;
                for (record in this.depositsHistory) {
                    this.transtate = this.depositsHistory[record];
                    console.log('Customer payments', this.transtate[0]);
                }
            }
        });

    }



    ngOnInit() {
        this.authService.getUser(this.authService.getUserData().uid).snapshotChanges().pipe(take(1)).subscribe((snapshot: any) => {
            this.passenger = {uid: snapshot.key, ...snapshot.payload.val()};
            this.passenger.isEmailVerified = this.authService.getUserData().emailVerified;
            console.log('The passengers Details',this.passenger);
        });
    }

    depositMoney() {
        console.log(`Deposit Mobile Money Clicked!`);
        // 1--- Add the input amount to balance ---
        this.playAudio5();
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        console.log('AUTO GENERATED CODE', retVal);
        this.alertCtrl.create({
            header: 'Mobile Money Deposit',
            inputs: [
                {name: 'amount', placeholder: 'Amount'},
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Deposit',
                    handler: data => {
                        console.log(data);
                        if (data.amount) {
                            this.common.showLoader();
                            try {
                                // --- Get Money from mobile money to wallet == PENDING
                                // Add Logic here ...
                                const url = "https://www.easypay.co.ug/api/";
                                const username = "37c8639b4912d708";
                                const passwd = "bb85e4bd9df13c96";

                                let smdata = {
                                    "username": username,
                                    "password": passwd,
                                    "action": "mmdeposit",
                                    "amount": data.amount,
                                    "currency": "UGX",
                                    "phone": this.passenger.phoneNumber,
                                    "reference": `EASY-CABS-WALLET-${ retVal }`,
                                    "reason": "Payment to Customer Wallet Account"
                                };

                                // console.log('What you entered', smdata.currency, smdata.amount, smdata.phone, smdata.reason, smdata.reference);
                                // --- Check if the customer has money on his account ---

                                this.http.post(url, JSON.stringify(smdata), {})
                                    .subscribe(response => {
                                            // prints 200
                                            console.log('API PASSENGER RESPONSE', response);

                                            let kd = JSON.stringify(response);

                                            try {
                                                if (response) {
                                                    var replx = response['success'];
                                                    var mydata = response;
                                                    var telecomId = response['details'].telecomId;
                                                    var reason = response['details'].reason;
                                                    var transactionId = response['details'].transactionId;

                                                    if (replx == 1) {
                                                        console.log('KD IS 1');
                                                        // calculate balance
                                                        let balance = (parseFloat(data.amount) + parseFloat(this.passenger.balance));

                                                        // console.log('check data', JSON.stringify(response.details.success));
                                                        this.transactionService.depostMM(data.amount, balance, smdata.reference,
                                                            telecomId, reason, transactionId
                                                        ).then(() => {
                                                            // this.common.showToast(`${data.amount} /= Deposited Successfully`);

                                                            // update the drivers balance
                                                            console.log('New Balancexx ', balance);
                                                            // 2: --- Update the old balance with new balance
                                                            // --- update Passengers Balance ---
                                                            this.db.object('passengers/' + this.passenger.uid).update({
                                                                balance: balance
                                                            });
                                                            this.common.hideLoader();
                                                            this.common.showToast(`Thank you! Amount ${data.amount}/= Deposited from Mobile Money to your Cashless account`);
                                                            console.log('Transaction successful');
                                                            let audio = new Audio(AUDIO_PATH);
                                                            audio.play();
                                                            this.router.navigateByUrl('/cashless');

                                                        });

                                                    }
                                                    else {
                                                        console.log('This is kd', kd);
                                                        this.common.showAlert('Transaction has Failed, Try Again');
                                                        this.common.showToast('Transaction has Failed, Try Again');
                                                    }
                                                }
                                                else {
                                                    console.log('something is wrong');
                                                    this.router.navigateByUrl('/home');
                                                }
                                            }
                                            catch (e) {
                                                console.log('something is wrong', e);
                                                this.router.navigateByUrl('/home');
                                            }
                                        }
                                        , (error) => {
                                            console.log("Catch result", error);
                                            this.router.navigateByUrl('/home');

                                        });


                            }
                            catch (e) {
                                this.common.showAlert('an error occurred');
                                console.log(e);
                            }
                        }

                    }
                }
            ]


        }).then(x => x.present());


    }

    playAudio5() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH5);
            audio.load();
            audio.play();
        }
    }

}
