import {Component, OnInit} from '@angular/core';
import {CommonService} from '../services/common.service';
import {AlertController} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {DepositService} from "../services/deposit.service";
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {DriverService} from '../services/driver.service';
import {CURRENCY_SYMBOL} from '../../environments/environment.prod';
import {TransactionService} from '../services/transaction.service';
import {HttpClient} from "@angular/common/http";
import {AUDIO_PATH, PLAY_AUDIO_ON_REQUEST} from 'src/environments/environment.prod';
import {TranslateService} from '@ngx-translate/core';

import {
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';


@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.page.html',
    styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {
    public driver: any;
    public deposits: any;
    currency: any = CURRENCY_SYMBOL;
    balance: 0.00;
    public transtate = [];

    constructor(private driverService: DriverService,
                private common: CommonService,
                private alertCtrl: AlertController,
                private db: AngularFireDatabase,
                private depositService: DepositService,
                private router: Router,
                private authService: AuthService,
                private translate: TranslateService,
                private transactionService: TransactionService,
                private http: HttpClient) {

        transactionService.getCashless().valueChanges().subscribe(snapshot => {
            if (snapshot != null) {
                this.deposits = snapshot.reverse();
                console.log('mydeposits', this.deposits);
                let record;
                for (record in this.deposits) {
                    this.transtate = this.deposits[record];
                    console.log('perez payments', this.transtate[0]);
                }

            }
        });
        this.driverService.getDriver().valueChanges().subscribe(snapshot => {
            this.driver = snapshot;
        });


    }

    ngOnInit() {
    }

    depositMoney() {
        this.playAudio5();
        console.log(`Deposit Mobile Money Clicked! and balance is ${this.driver.balance} /=`);
        // 1--- Add the input amount to balance ---
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
                                    "phone": this.driver.phoneNumber,
                                    "reference": `EASY-CABS-WALLET-${ retVal }`,
                                    "reason": "Deposit to Wallet Account"
                                };
                                // console.log('What you entered', smdata.currency, smdata.amount, smdata.phone, smdata.reason, smdata.reference);
                                // --- Check if the customer has money on his account ---

                                this.http.post(url, JSON.stringify(smdata), {})
                                    .subscribe(response => {
                                            // prints 200
                                            console.log('API RESPONSE', response);
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
                                                        let balance = (parseFloat(data.amount) + parseFloat(this.driver.balance));
                                                        // record transaction to firebase

                                                        // console.log('check data', JSON.stringify(response.details.success));
                                                        this.transactionService.depostMM(data.amount, balance, smdata.reference,
                                                            telecomId, reason, transactionId
                                                            // , mydata.phone, mydata.reason, mydata.charge,
                                                            // mydata.date, mydata.TxID, mydata.currencyCode
                                                        ).then(() => {
                                                            // this.common.showToast(`${data.amount} /= Deposited Successfully`);

                                                            // update the drivers balance
                                                            console.log('New Balancexx ', balance);




                                                            // 2: --- Update the old balance with new balance
                                                            // --- update Drivers Balance ---
                                                            this.db.object('drivers/' + this.driver.uid).update({
                                                                balance: balance
                                                            });



                                                            this.common.hideLoader();
                                                            this.common.showToast(`Thank you! Amount ${data.amount}/= Deposited from Mobile Money to your Wallet`);
                                                            console.log('Transaction successful');
                                                            let audio = new Audio(AUDIO_PATH);
                                                            audio.play();
                                                            console.log('api is working')

                                                        }, (error) => {
                                                            console.log('System failure, Try Again!', error)
                                                        });
                                                    }
                                                    else {
                                                        console.log('This is kd', kd);
                                                        this.common.showAlert('Transaction has Failed, Try Again');
                                                        // this.common.showToast('Transaction has Failed, Try Again');
                                                    }
                                                }
                                                else {
                                                    this.router.navigateByUrl('/home');
                                                }
                                            }
                                            catch (e) {
                                                this.router.navigateByUrl('/home');
                                            }
                                        }
                                        , (error) => {
                                            console.log("Catch result ");
                                            this.router.navigateByUrl('/home');
                                        });
                            }
                            catch (e) {
                                this.common.showAlert('an error occurred');
                                console.log(e);
                            }
                        }
                        else{
                            this.common.showAlert('Amount Field is empty');
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

    playAudio4() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH4);
            audio.load();
            audio.play();
        }
    }
}

