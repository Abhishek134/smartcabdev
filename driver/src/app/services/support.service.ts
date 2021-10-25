import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private db: AngularFireDatabase, private authService: AuthService,) { }

    sendMessage(your_name: string ,phone: string ,message: string){
        let transporter = this.authService.getUserData();
        let userdetails = this.authService.getUser(transporter.uid);

        return this.db.list('support/').push({
            full_name: your_name,
            phone: phone,
            message: message,
            userId: transporter.uid,
            name_driver: transporter.displayName,
            createAt: Date.now(),
            status: 'Pending',
            response_from: '',
            uid: transporter.uid
        });

    }

    getMessages() {
        let user = this.authService.getUserData();
        console.log(user);
        return this.db.list('support', ref => ref.orderByChild('userId').equalTo(user.uid));
    }

}
