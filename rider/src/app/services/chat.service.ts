import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private db: AngularFireDatabase, private authService: AuthService) { }

    // get driver's trip
    getDriverChat(referencex) {
        let user = this.authService.getUserData();
        return this.db.list('chat', ref => ref.orderByChild('referenceCode').equalTo(referencex));
    }
}
