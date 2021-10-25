import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class CommonfunctionService {

    constructor(private toastController: ToastController) {

    }

    // validateEmail(email) {
    //     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return re.test(String(email).toLowerCase());
    // }

    async presentToast(message, showButton, position, duration) {
        const toast = await this.toastController.create({
            message: message,
            showCloseButton: showButton,
            position: position,
            duration: duration
        });
        toast.present();


    }
}
