import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-termsmodal',
    templateUrl: './termsmodal.page.html',
    styleUrls: ['./termsmodal.page.scss'],
})
export class TermsmodalPage implements OnInit {

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }
    closeModalX(){
        this.modalController.dismiss();
    }

}
