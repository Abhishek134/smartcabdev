import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class MiniService {

  constructor(private db: AngularFireDatabase) { }

    filterMini(region1) {
        return this.db.list('drivers', ref => ref.orderByChild('transid').equalTo('Mini' + region1));
    }

}
