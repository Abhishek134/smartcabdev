import {Component, OnInit} from '@angular/core';
import {DriverService} from '../services/driver.service';
import {TransactionService} from '../services/transaction.service';
import {TranslateService} from '@ngx-translate/core';
import {CURRENCY_SYMBOL} from '../../environments/environment.prod';
import {CommonService} from '../services/common.service';
import {AlertController} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {DepositService} from "../services/deposit.service";
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {HttpClient} from "@angular/common/http";
import * as firebase from 'firebase';

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
    selector: 'app-payment',
    templateUrl: './payment.page.html',
    styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
    public payments: any;
    public driver: any;
    public boda: any;
    public car: any;
    public transtate = [];
    currency: any = CURRENCY_SYMBOL;
    balance: 0.00;
    mydate: any;
    excess: any;
    amount: any;
    today;
    old_date;
    paymentDate;
    currentDate;
    old_user;
    dsuser;
    deposits: any = {};

    constructor(private transactionService: TransactionService,
                private translate: TranslateService,
                private driverService: DriverService,
                private common: CommonService,
                private alertCtrl: AlertController,
                private db: AngularFireDatabase,
                private depositService: DepositService,
                private router: Router,
                private authService: AuthService,
                private http: HttpClient) {
        // get Payments from service

        transactionService.getComissionPayBacks().valueChanges().subscribe(snapshot => {
            if (snapshot != null) {
                this.payments = snapshot.reverse();
                console.log('mycashpaybacks', this.payments);

                let record;
                for (record in this.payments) {
                    this.transtate = this.payments[record];
                    console.log('perez payments', this.transtate[0]);
                }

            }
        });


        // we get the driver
        this.driverService.getDriver().valueChanges().subscribe(snapshot => {
            this.driver = snapshot;

        });

        // boda
        this.depositService.filterBoda().valueChanges().subscribe(snapshot => {
            this.boda = snapshot;

            this.boda.forEach(el => this.boda = el.charge);
            console.log('BODA XX', this.boda);
        });
        // car
        this.depositService.filterCar().valueChanges().subscribe(snapshot => {
            this.car = snapshot;
            this.car.forEach(el => this.car = el.charge.toString());
            console.log('CAR XX', this.car);
        });
    }


    ngOnInit() {
        console.log('FIREBASE SERVER TIME', firebase.firestore.Timestamp.now().toDate());
    }

    ionViewDidEnter() {
        // if (this.authService.getUserData() != null) {
        //     this.driverService.getDriver().valueChanges().subscribe((snapshot: any) => {
        //         if (snapshot != null) {
        //             console.log(snapshot);
        //             this.driver = snapshot;
        //         }
        //     });
        // }else {
        //     this.router.navigateByUrl('/home');
        // }


    }

    payNow() {

        // PEREZ CODE
        console.log('xxx', this.driver.uid);
        this.playAudio5();
        this.depositService.filterDeposit(this.driver.uid).valueChanges().subscribe((snapshot: any) => {
            this.old_date = snapshot;
            this.old_user = snapshot;
            // let kk = snapshot.createdAt;
            console.log('the data here', this.old_user);
            this.old_date.forEach(el => this.old_date = el.createAt);
            this.old_user.forEach(el => this.old_user = el.userId);
            let kk = new Date(this.old_date).toLocaleDateString();
            this.dsuser = this.old_user;
            this.paymentDate = kk;
            // this.currentDate = new Date().toISOString().substring(0, 10);
            this.currentDate = new Date().toLocaleDateString();
            console.log('Payment Date', this.paymentDate.toString());
            console.log('Today Date', this.currentDate.toString());
            console.log('Old User', this.dsuser);

        });


        this.alertCtrl.create({
            header: 'Wallet Payment (UGX)',
            cssClass: 'disabled',
            inputs: [
                // {name: 'amount', placeholder: 'Amount', value: this.amount},
                {name: 'amount', placeholder: 'Amount'},
            ],
            buttons: [
                {
                    text: 'Wallet Pay',
                    handler: data => {
                        console.log('Pay using backup clicked');
                        console.log(data);

                        if (data.amount) {
                            this.playAudio5();
                            this.common.showLoader();
                            //  3  We Deduct 2000/= for the day from wallet

                            if (parseFloat(this.driver.balance) > parseFloat(data.amount)) {
                                let new_commission_balance = parseFloat(this.driver.commission_balance) - parseFloat(data.amount);
                                console.log('New Commission Balance', new_commission_balance);
                                let balance = parseFloat(this.driver.balance) - parseFloat(data.amount);
                                console.log('New Balance', balance);

                                this.db.object('drivers/' + this.driver.uid).update({
                                    balance: balance,
                                    commission_balance: new_commission_balance
                                });

                                let paymentMethod = 'Wallet Pay';
                                let wallet_balance = this.driver.balance;
                                let telecomId = '';

                                // Record the loan payDebtTransactions
                                this.transactionService.payDebtTransactions(data.amount, new_commission_balance, paymentMethod, wallet_balance, telecomId).then(() => {
                                    console.log('Debt Payment received through Wallet Pay method')
                                }, (error) => {
                                    console.log('Some thing went wrong!')

                                });

                                this.common.showToast(`Thank you, We have deducted amount of ${data.amount}/= from wallet`);
                                this.router.navigateByUrl('/home');
                            }
                            else {
                                console.log('Your have less wallet balance amount');
                                this.common.showAlert('Your wallet balance is low');
                                this.router.navigateByUrl('/payment');
                            }

                        }
                        else {
                            console.log('Please enter amount');
                            this.common.showAlert('Amount Field is empty');
                        }


                    }
                }
                ,

                {
                    text: 'Mobile M Pay',
                    handler: data => {
                        console.log('Pay using Mobile Money clicked');
                        console.log(data);
                        if (data) {


                            // 1 We add the money from his mobile money to wallet
                            if (data.amount) {
                                this.playAudio5();
                                this.common.showLoader();
                                try {

                                    // --- Get Money from mobile money to wallet == PENDING
                                    var length = 8,
                                        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                                        retVal = "";
                                    for (var i = 0, n = charset.length; i < length; ++i) {
                                        retVal += charset.charAt(Math.floor(Math.random() * n));
                                    }
                                    console.log('AUTO GENERATED CODE', retVal);

                                    // Add Logic here ...
                                    const url = "https://www.easypay.co.ug/api/";
                                    const username = "xxxxxxxxxx";
                                    const passwd = "xxxxxxxxxxxxxxxxxxxx";
                                    let smdata = {
                                        "username": username,
                                        "password": passwd,
                                        "action": "mmdeposit",
                                        "amount": parseInt(data.amount),
                                        "currency": "UGX",
                                        "phone": this.driver.phoneNumber,
                                        "reference": `${retVal}`,
                                        "reason": "Smart Cabs Debt Payment"
                                    };
                                    console.log('What you entered', smdata.currency, smdata.amount, smdata.phone, smdata.reason, smdata.reference);
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

                                                        console.log('xxxxx', replx);
                                                        if (replx == 1) {
                                                            console.log('KD IS 1');

                                                            // 2 Record Payment in deposit Table

                                                            this.transactionService.makePayment(data.amount, this.driver.commission_balance).then(() => {
                                                                // this.common.showToast(`Thank you we have received your payment of ${data.amount}/=`);
                                                                console.log(`Transaction recorded to Database ${data.amount}/=`)
                                                            });

                                                            //  3  We Deduct amount/= from driver commission balance
                                                            let new_commission_balance = parseFloat(this.driver.commission_balance) - parseFloat(data.amount);
                                                            console.log('New Commission Balance', new_commission_balance);

                                                            this.db.object('drivers/' + this.driver.uid).update({
                                                                commission_balance: new_commission_balance,
                                                                reference: smdata.reference,
                                                                telecomId: telecomId,
                                                                reason: reason,
                                                                transactionId: transactionId
                                                            }).then(() => {
                                                                // this.common.showToast(`${data.amount} /= Deposited Successfully`);

                                                                // update the drivers balance
                                                                console.log('New Balancexx ', new_commission_balance);

                                                                let paymentMethod = 'Mobile M Pay';
                                                                let wallet_balance = this.driver.balance;

                                                                // Record the loan payDebtTransactions
                                                                this.transactionService.payDebtTransactions(data.amount, new_commission_balance, paymentMethod, wallet_balance, telecomId).then(() => {
                                                                    console.log('Debt Payment received through Mobile Money Pay method')
                                                                }, (error) => {
                                                                    console.log('Some thing went wrong!')

                                                                });

                                                                this.common.hideLoader();
                                                                this.common.showToast(`Thank you! Amount ${data.amount}/= Deposited from Mobile Money to your Wallet`);
                                                                console.log('Transaction successful');
                                                                this.common.showToast(`Thank you, We have Received your payment of amount ${data.amount}/= from Mobile Money`);
                                                                this.router.navigateByUrl('/home');

                                                                let audio = new Audio(AUDIO_PATH);
                                                                audio.play();
                                                            }, (error) => {
                                                                console.log('System failure, Try Again!', error)
                                                            });
                                                        }
                                                        else {
                                                            console.log('This is kd', kd);
                                                            this.common.showAlert('Transaction has Failed, Try Again');
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
                                                console.log("Catch result ", error);
                                                this.router.navigateByUrl('/payment');
                                            });
                                }
                                catch (e) {
                                    this.common.showAlert('an error occurred');
                                    console.log(e);
                                }
                            }
                            else {
                                this.common.showAlert('Amount Field is empty');
                            }

                        } else {
                            console.log('Amount Field is empty');

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
