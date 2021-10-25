import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {CommonService} from '../services/common.service';
import {AlertController} from '@ionic/angular';
import {SupportService} from '../services/support.service';

// import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-complains',
    templateUrl: './complains.page.html',
    styleUrls: ['./complains.page.scss'],
})
export class ComplainsPage implements OnInit {
    public messages: any;
    public transtate = [];

    constructor(private platform: Platform,
                private common: CommonService,
                private supportService: SupportService,
                private alertCtrl: AlertController) {
        supportService.getMessages().valueChanges().subscribe(snapshot => {
            if (snapshot != null) {
                this.messages = snapshot.reverse();
                console.log('My Messages', this.messages);
                let record;
                for (record in this.messages) {
                    this.transtate = this.messages[record];
                    console.log('perez Messages', this.transtate[0]);
                }
            }
        });
    }

    ngOnInit() {
        this.platform.backButton.subscribe(() => {
            // do something here
        });
    }

    addComplain() {
        console.log('Add Complain Clicked');
        this.alertCtrl.create({
            header: 'Your Support Center',
            inputs: [
                {name: 'your_name', placeholder: 'Enter your full name'},
                {name: 'phone', placeholder: 'Enter phone number'},
                {name: 'message', placeholder: 'Enter your message'},
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Send Inquiry',
                    handler: data => {
                        console.log(data);
                        if (data) {
                            try {
                                console.log('GOOD! Entered correct data!');
                                this.supportService.sendMessage(data.your_name, data.phone, data.message).then(() => {
                                    this.common.showToast(`Thank you, We have received your inquiry, Our Team shall call and message you shortly`);
                                });
                            }
                            catch (e) {
                                this.common.showAlert('an error occured');
                                console.log(e);
                            }
                        }
                        else {
                            this.common.showToast(`Sorry, Invalid Entries `);
                            console.log('You have empty fields')
                        }
                    }
                }
            ]
        }).then(x => x.present());
    }

    seeReply() {
        console.log('See your reply from support!');
    }


}
