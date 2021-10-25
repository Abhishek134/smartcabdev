import {Component, OnInit} from '@angular/core';
import {DriverService} from '../services/driver.service';
import {TransactionService} from '../services/transaction.service';
import {TranslateService} from '@ngx-translate/core';
import {CURRENCY_SYMBOL} from '../../environments/environment.prod';
import {CommonService} from '../services/common.service';
import {AlertController} from '@ionic/angular';
import {
    AUDIO_PATH3,
    AUDIO_PATH4,
    AUDIO_PATH5,
    PLAY_AUDIO_ON_REQUEST,
    DEAL_TIMEOUT,
    POSITION_INTERVAL,
    DEAL_STATUS_PENDING
} from 'src/environments/environment.prod';


@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

    public records: any;
    public driver: any;
    public transtate = [];
    currency: any = CURRENCY_SYMBOL;
    minbalance: 10000.00;

    constructor(private transactionService: TransactionService,
                private translate: TranslateService,
                private driverService: DriverService,
                private common: CommonService,
                private alertCtrl: AlertController) {
        // get transactions from service
        transactionService.getTransactions().valueChanges().subscribe(snapshot => {
            if (snapshot != null) {
                this.records = snapshot.reverse();
                console.log('mytrans', this.records);

                let record;
                // tslint:disable-next-line:forin
                for (record in this.records) {
                    this.transtate = this.records[record];
                    console.log('perez status', this.transtate[0]);
                }

            }
        });
        this.driverService.getDriver().valueChanges().subscribe(snapshot => {
            this.driver = snapshot;
        });

    }

    withdraw() {

        this.alertCtrl.create({
            header: 'Make a Withdraw',
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
                    text: 'Submit',
                    handler: data => {
                        console.log(data);

                        this.playAudio5();
                        if (parseFloat(data.amount) > parseFloat(this.driver.balance)) {
                            this.common.showAlert('Insufficient Balance');
                        } else if (parseFloat(data.amount) <= parseFloat(this.driver.balance)) {

                            try {
                                if (this.transtate['status'] !== 'PENDING') {
                                    this.transactionService.widthDraw(data.amount, this.driver.balance).then(() => {
                                        this.common.showToast('withdraw Requested');
                                        console.log('mystate', this.transtate['status']);
                                    });
                                }
                                else {
                                    this.common.showAlert('You have already requested withdraw');
                                }

                            } catch (e) {
                                this.common.showAlert('an error occured');
                                console.log(e);
                            }

                        } else {

                        }

                    }
                }
            ]
        }).then(x => x.present());
    }

    ngOnInit() {
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
