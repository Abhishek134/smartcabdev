import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TripService} from '../services/trip.service';
import {Router} from '@angular/router';
import {DealService} from '../services/deal.service';
// import {Observable} from 'rxjs';
import {take} from 'rxjs/operators'
import {AlertController, MenuController} from '@ionic/angular';
import {CommonService} from '../services/common.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {SMS} from "@ionic-native/sms/ngx";
import {ModalController} from '@ionic/angular';
import {ChatPage} from '../chat/chat.page';
import {ChatService} from "../services/chat.service";
import {DriverService} from '../services/driver.service';
import {TransactionService} from '../services/transaction.service';
import {AuthService} from '../services/auth.service';


@Component({
    selector: 'app-pickup',
    templateUrl: './pickup.page.html',
    styleUrls: ['./pickup.page.scss'],
})
export class PickupPage implements OnInit {


    trip: any = {};
    passenger: any = {};
    driverDetail: any = {};
    passengerDetail: any = {};
    cashdriver: any = {};
    walletdriver: any = {};
    isTripStarted = false;
    discount;
    tax;
    message: string = '';
    public payments: any;
    public transtate = [];
    user: any = {};
    seconds;
    distanceText: any = '';

    constructor(private tripService: TripService,
                private alertCtrl: AlertController,
                private dealService: DealService,
                private router: Router,
                private common: CommonService,
                private translate: TranslateService,
                private db: AngularFireDatabase,
                private menuCtrl: MenuController,
                private geolocation: Geolocation,
                private sms: SMS,
                private modalController: ModalController,
                private driverService: DriverService,
                private transactionService: TransactionService,
                private authService: AuthService,
                private chatService: ChatService) {

        this.menuCtrl.enable(true);


    }

    ngOnInit() {
        this.authService.getUser(this.authService.getUserData().uid).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
            console.log(snapshot);
            this.user = snapshot;
            this.common.hideLoader();
        });
    }

    ionViewDidLoad() {

    }

    ionViewDidEnter() {
        this.trip = this.tripService.getCurrentTrip();
        this.discount = (this.trip.rawfee * (this.trip.discount / 100)).toFixed(2)
        this.tax = (this.trip.fee * (this.trip.tax / 100)).toFixed(2);
        let getTrips = this.tripService.getTripStatus(this.trip.key).valueChanges().subscribe((trip: any) => {
            console.log(trip);
            if (trip.status == 'canceled') {
                getTrips.unsubscribe();
                this.tripService.cancel(this.trip.key);
                this.dealService.removeDeal(this.trip.driverId);
                this.common.showAlert("Trip Cancelled");
                this.router.navigateByUrl('/home');
            }
        });
        // this.tripService.getPassenger(this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
        //     this.passenger = snapshot;
        //     console.log('my passenger', this.passenger);
        // });

        this.db.object('passengers/' + this.trip.passengerId).valueChanges().pipe(take(1)).subscribe(snapshot => {
            this.passenger = snapshot;
            console.log('my passenger Phone', this.passenger.phoneNumber);
        });
    }


    cancelTrip() {
        this.alertCtrl.create({
            message: "Are you sure want to cancel the trip",
            buttons: [{
                text: "Yes",
                handler: () => this.tripService.cancel(this.trip.key)
            }, {
                text: "No"
            }]
        }).then(res => res.present());
    }

    // pickup
    pickup() {
        this.alertCtrl.create({
            subHeader: "Please Enter OTP from customer",
            inputs: [{
                name: 'otp',
                placeholder: '4 digit OTP',
            }],
            buttons: [{
                text: "Verify",
                handler: (data) => {
                    console.log(data);
                    this.db.object('trips/' + this.trip.key).valueChanges().pipe(take(1)).subscribe((res: any) => {
                        console.log(res);
                        if (res.otp != data.otp) {
                            this.common.showAlert("Invalid OTP");
                        }
                        else {
                            // // -- timer code --
                            // var timerText = document.getElementById('counting');
                            // let count= 0;
                            // setInterval(function () {
                            //     console.log('Timer started');
                            //     count += 1;
                            //     timerText.textContent = count;
                            // }, 1000);

                            this.isTripStarted = true;
                            this.tripService.pickUp(this.trip.key);
                        }
                    })
                }
            }]
        }).then(res => res.present());
    }

    // countdownMin() {
    //     console.log('Minute counting in progress');
    //     var timerText = document.getElementById('counting');
    //     // let seconds = 0;
    //     // // function incrementSeconds() {
    //     // seconds += 1;
    //     // console.log("You have been here for " + seconds + " seconds.");
    //     // // }
    //     // return seconds
    // }


    // === pick up for perez ===
    // pickup() {
    //     this.db.object('trips/' + this.trip.key).valueChanges().pipe(take(1)).subscribe((res: any) => {
    //         console.log(res);
    //         this.isTripStarted = true;
    //         this.tripService.pickUp(this.trip.key)
    //
    //     })
    // }

    getDirection(lat, lng) {
        console.log("call");
        this.geolocation.getCurrentPosition().then(geo => {
            geo.coords.latitude;
            let url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=" + geo.coords.latitude + "," + geo.coords.longitude + "&destination=" + lat + "," + lng;
            window.open(url);
        }).catch(err => {
            console.log("Error ");
        })
    }


    // --- Todays calculations will go here perez ---
    showPayment() {
        // console.log('actual seconds', this.seconds);
        // setInterval(this.countdownMin(), 1000);
        this.alertCtrl.create({
            header: "Are you sure want to complete the trip?",
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {

                        if (this.trip.paymentMethod == 'wallet') {
                            // CASHLESS TRIP
                            try {
                                //--- update the wallet or driver balance
                                // --- for driver ---
                                console.log('commision', this.trip.commission);
                                // --- calculate drivers new balance ---
                                // var newDriverBalance = (parseFloat(this.trip.commission) + parseFloat(this.driverDetail.balance));
                                console.log('DRIVERS OLD BALANCE', this.driverDetail.balance);

                                // GET THE DRIVERS DETAILS
                                this.driverService.getDriver().valueChanges().subscribe(snapshot => {
                                    this.walletdriver = snapshot;
                                    console.log('The Drivers Id', this.trip.driverId);
                                    // console.log('The Drivers BALANCE', this.newdriver.balance);
                                    // this.db.object('drivers/' + this.trip.driverId).update({
                                    //     myEarnings: (parseFloat(this.trip.commission) + parseFloat(this.newdriver.balance))
                                    //
                                    // });
                                    // console.log('Driver balance updated successfully');




                                });

                                // --- DEDUCT DRIVER PAY FROM EASYGO WALLET  --- Pending

                                // --- UPDATE THE DRIVER WALLET EARNINGS --- Pending

                                // --- DEDUCT TRIP CHARGE FROM EASGO WALLET --- Pending


                                // --- UPDATE SMART BALANCE WITH CHARGE ABOVE--- Pending

                                // ---

                                this.tripService.dropOff(this.trip.key);
                                this.dealService.removeDeal(this.trip.driverId);
                                this.router.navigateByUrl('/wallet');
                                //    show success message to driver

                            }
                            catch (e) {
                                console.log('Error occurred', e);
                            }

                        }
                        // --- CASH TRIP ---
                        else {

                            console.log('Cash Payment was Selected');
                            // --- ITS CASH PAYMENT ---
                            // --- CREATE commission_balance = 0 in Driver Register
                            //   commision_balance = 0;

                            // GET THE DRIVERS DETAILS == DONE
                            this.driverService.getDriver().valueChanges().pipe(take(1)).subscribe(snapshot => {
                                this.cashdriver = snapshot;
                                // this.db.object('drivers/' + this.trip.driverId).update({
                                //     myEarnings: (parseFloat(this.trip.commission) + parseFloat(this.newdriver.balance))
                                // });
                                // console.log('Driver balance updated successfully');

                                // --- ADD TRIP COMMISSION TO commission_balance IN DRIVER TABLE == Done

                                // --- CHECK IS commission_balance >= 10000 == Done
                                console.log('commission xxxx', this.user);
                                console.log('commission ccc', this.user.commission_balance);
                                if (parseFloat(this.cashdriver.commission_balance) >= 10000) {
                                    // --- IF DRIVER WALLET BALANCE >= commission_balance --- Done
                                    if (parseFloat(this.cashdriver.balance) >= parseFloat(this.cashdriver.commission_balance)) {
                                        console.log('2xxx');
                                        // === YES:
                                        //--- DEDUCT WALLET BALANCE - commission_balance --- Done
                                        // --- CALCULATE THE NEW DRIVER BALANCE -- Done
                                        // calculate current trip commission
                                        var easygocommission = (parseFloat(this.trip.fee) - parseFloat(this.trip.commission));
                                        // calculate all due commission
                                        var totalcommission = (easygocommission + parseFloat(this.cashdriver.commission_balance));
                                        // Get off smartcab payment
                                        console.log('smartcab commission', easygocommission);
                                        var newcashbalance = (parseFloat(this.cashdriver.balance) - totalcommission);
                                        console.log('new driver net balance', newcashbalance);
                                        // --- STORE TRANSACTION IN DRIVER_TRANSACTION (NOTE THIS IS A NEW TABLE)  --- Done

                                        this.db.list('/driver_transaction').push({
                                            createdAt: Date.now(),
                                            driverId: this.cashdriver.uid,
                                            driverName: this.cashdriver.name,
                                            driverEmail: this.cashdriver.email,
                                            tripfee: this.trip.fee,
                                            lasttripcommission: easygocommission, // Last trip Commission
                                            easygocommissiondebt: totalcommission, // Total money smartcabs takes
                                            driverearned: this.trip.commission, // money the driver is taking
                                            passengerName: this.passenger.name,
                                            passengerPhone: this.passenger.phoneNumber,
                                            origin: this.trip.origin.vicinity,
                                            destination: this.trip.destination.vicinity,
                                            driveroldbalance: this.cashdriver.balance,
                                            drivernewbalance: newcashbalance,
                                            reason: 'Deducted payment from Drivers Wallet',
                                            amount_deducted: this.trip.commission,
                                            methodtype: 'cash'
                                        }).then(() => {
                                            console.log(`Transaction Recorded to Smart Cabs Table!`)
                                        }).catch(() => {
                                            //    Error Handle
                                            console.log('Failed to send Data!');
                                        });


                                        var driverearning1 = (parseFloat(this.trip.commission) + parseFloat(this.cashdriver.cashEarnings));
                                        // ---UPDATE THE BALANCE OF DRIVER == newcashbalance == Done
                                        this.db.object('drivers/' + this.trip.driverId).update({
                                            // balance: (parseFloat(this.trip.commission) + parseFloat(this.cashdriver.balance))
                                            balance: newcashbalance,
                                            commission_balance: 0,
                                            cashEarnings: driverearning1
                                        });
                                        console.log('Driver balance updated successfully');

                                        // START ALERT
                                        this.alertCtrl.create({
                                            header: 'Thank you',
                                            message: `We have Deducted UGX ${ easygocommission }/= and your Commission Debt is now fully settled`,
                                            buttons: [
                                                {
                                                    text: 'Close',
                                                    handler: data => {
                                                        console.log('Cancel clicked');
                                                    }
                                                }
                                            ]
                                        }).then(x => x.present());
                                        // END ALERT


                                        this.router.navigateByUrl('/home');


                                    }
                                    else {
                                        console.log('3xxx');
                                        console.log('Driver Balance is less than Comission');
                                        //    --- WALLET BALANCE IS LESS
                                        //--- LOCK THE APP MAP ON HOME PAGE (EXTERNAL) --Pending

                                        // --- POPUP NOTIFICATION LOW ACCOUNT BALANCE --- Done
                                        // START ALERT
                                        this.alertCtrl.create({
                                            header: 'Attention!',
                                            message: `Your Wallet Balance is less than UGX: 10000/= Please TopUp to Continue`,
                                            buttons: [
                                                {
                                                    text: 'Dismiss',
                                                    handler: data => {
                                                        console.log('Cancel clicked');
                                                    }
                                                },
                                                {
                                                    cssClass: 'success',
                                                    text: 'Top Up Now',
                                                    handler: data => {
                                                        console.log('Wants to pay!');
                                                        //--- REDIRECT DRIVER TO DEPOST MOBILE MONEY PAGE --- Done
                                                        this.router.navigateByUrl('/deposit');
                                                    }
                                                }

                                            ]
                                        }).then(x => x.present());
                                        // END ALERT


                                    }
                                }
                                else {
                                    console.log('4xxx');
                                    // commission_balance < 10000
                                    // GET THE CURRENT TRIP SMARTCAB COMMISSION === Done
                                    var easygosinglecommission = (parseFloat(this.trip.fee) - parseFloat(this.trip.commission));
                                    // ADD THE COMMISSION TO commission_balance === Done
                                    var newcommision_balance = (this.cashdriver.commission_balance + easygosinglecommission);
                                    // CALCULATE DRIVERS CASH EARNINGS
                                    var driverearning = (parseFloat(this.trip.commission) + parseFloat(this.cashdriver.cashEarnings));

                                    // ---UPDATE THE BALANCE OF DRIVER == newcashbalance == Done
                                    this.db.object('drivers/' + this.trip.driverId).update({
                                        // balance: (parseFloat(this.trip.commission) + parseFloat(this.cashdriver.balance))
                                        // balance: newcashbalance,
                                        commission_balance: newcommision_balance,
                                        cashEarnings: driverearning
                                    });
                                    console.log('Driver balance updated successfully');
                                    //    REDIRECT BACK TO HOME PAGE === Pending
                                    this.router.navigateByUrl('/home');
                                }
                            });

                            this.tripService.dropOff(this.trip.key, );
                            this.dealService.removeDeal(this.trip.driverId);
                            this.router.navigateByUrl('/home');
                        }
                    }
                },
                {
                    text: "No"
                }
            ]
        }).then(res => res.present());
    }

    // sendMessage() {
    //     this.sms.send(this.passenger.phoneNumber, `Hello its me ${this.passenger.name} on SmartCabs, Where are you?`);
    // }

    openModal() {
        this.modalController.create({component: ChatPage}).then((modalElement) => {
            console.log('Passenger details', this.passenger);
            console.log('Trip details', this.trip);
            this.getDriverDetail();
            modalElement.present();
        });
    }

    getDriverDetail() {

        try {
            this.db.object('drivers/' + this.trip.driverId)
                .valueChanges()
                .pipe(take(1))
                .subscribe((res: any) => {
                    console.log('Driver Details', res);
                    this.driverDetail = res;
                });
            this.db.object('passengers/' + this.trip.passengerId)
                .valueChanges()
                .pipe(take(1))
                .subscribe((res: any) => {
                    console.log('Passenger Details', res);
                    this.passengerDetail = res;
                });
        }
        catch (e) {
            console.log('No Driver Found!');
        }
    }
}
