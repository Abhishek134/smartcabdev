import {Component, OnInit} from '@angular/core';
import {TripService} from '../services/trip.service';
import {Router, ActivatedRoute} from '@angular/router';
import {CommonService} from '../services/common.service';
import {AlertController} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {take} from 'rxjs/operators'
import {SettingService} from '../services/setting.service';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.page.html',
    styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
    trip: any = {};
    driver: any = {};
    rating: any = 5;
    discount;
    tax;
    passenger: any = {};

    constructor(private tripService: TripService,
                private router: Router,
                private route: ActivatedRoute,
                private common: CommonService,
                private alertCtrl: AlertController,
                private settingService: SettingService,
                private db: AngularFireDatabase,) {
        this.route.queryParams.subscribe(data => {

            this.driver = JSON.parse(data.driver);
            this.trip = JSON.parse(data.trip);
            this.discount = (this.trip.rawfee * (this.trip.discount / 100)).toFixed(0);
            this.tax = (this.trip.fee * (this.trip.tax / 100)).toFixed(0);
        })
    }

    ngOnInit() {
    }

    onRateChange(event) {
        console.log(event);
        this.rating = event;
    }

    rateTrip() {
        console.log(this.rating);
        this.tripService.rateTrip(this.trip.key, this.rating).then(() => {
            this.common.showToast("Thanks for your rating");
        }).catch((err) => {
            console.log(err);
            this.common.showToast("Something went wrong");
        });
    }

    finishTrip() {
        if (this.trip.paymentMethod == 'wallet') {
            console.log('Method is Wallet');
            this.alertCtrl.create({
                message: "Pay and complete the trip?",
                buttons: [
                    {
                        text: "Yes",
                        handler: () => {
                            // --- get passenger details == done
                            this.db.object('passengers/' + this.trip.passengerId).valueChanges()
                                .pipe(take(1)).subscribe(snapshot => {
                                this.passenger = snapshot;
                                console.log('my passenger Phone', this.passenger.phoneNumber);
                                console.log('my passenger ID', this.passenger.uid);


                                // --- Check if balance is greater= than amount == done
                                var trip_amount = parseFloat(this.trip.fee);
                                if (trip_amount <= parseFloat(this.passenger.balance)) {

                                    console.log('amount to be deducted', trip_amount);
                                    console.log('old balance', this.passenger.balance);
                                    // --- calculate the new balance ---

                                    // --- yes -- deduct trip amount -- done
                                    var new_passengerBalance = (parseFloat(this.passenger.balance) - trip_amount);
                                    console.log('our new balance', new_passengerBalance);
                                    console.log('vvv 1');

                                    // --- update the passengers balance === done
                                    this.db.object('passengers/' + this.trip.passengerId).update({
                                        balance: new_passengerBalance
                                    });

                                    // --- for driver ---
                                    var trip_amount1 = parseFloat(this.trip.commission);
                                    // --- calculate drivers new balance ---
                                    var newDriverBalance = (trip_amount1 + parseFloat(this.driver.balance));
                                    var cashless = (trip_amount1 + parseFloat(this.driver.cashlessEarnings));
                                    console.log('New Driver balance calculated', newDriverBalance);

                                    // --- Update and increment driver balance --- done
                                    this.db.object('drivers/' + this.driver.uid).update({
                                        balance: newDriverBalance,
                                        cashlessEarnings: cashless
                                    });
                                    console.log('Driver balance updated successfully');

                                    this.tripService.finishTrip(this.trip.key);
                                    console.log('Trip Ended successfully!');
                                    //    --- show Transaction successful popup === done
                                    this.alertCtrl.create({
                                        message: "Thank you for using Smart Cabs, your payment was successful",
                                        buttons: [

                                            {
                                                text: "Close"
                                            }
                                        ]
                                    }).then(res => res.present());

                                //    SEND USER TO HOME
                                    this.tripService.finishTrip(this.trip.key);
                                    this.router.navigateByUrl('/home');
                                }
                                else {
                                    console.log('vvv 2');
                                    console.log('EROR:: Trip amount is greater than balance');
                                    // --- show low Cash on wallet popup == pending
                                    this.alertCtrl.create({
                                        message: "Low Balance on your Wallet, Topup Mobile Money?",
                                        buttons: [
                                            {
                                                text: "Yes",
                                                handler: () => {
                                                    console.log('Wants to add more money to wallet');
                                                    //    go to wallet page to pay == done
                                                    this.router.navigateByUrl('/cashless');
                                                }
                                            },
                                            {
                                                text: "No"
                                            }
                                        ]
                                    }).then(res => res.present());


                                }


                            });

                        }
                    },
                    {
                        text: "No"
                    }
                ]
            }).then(res => res.present());


        }
        // --- Using Cash --- done
        else if (this.trip.paymentMethod == 'cash') {
            console.log('Method is Cash');
            this.alertCtrl.create({
                message: "Do you want to complete the trip?",
                buttons: [
                    {
                        text: "Yes",
                        handler: () => {

                            console.log('Trip Ended successfully!')
                        }
                    },
                    {
                        text: "No"
                    }
                ]
            }).then(res => res.present());
            this.tripService.finishTrip(this.trip.key);
            this.router.navigateByUrl('/home');
        }


    }
}
