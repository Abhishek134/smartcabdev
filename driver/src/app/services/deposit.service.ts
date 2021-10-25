import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DepositService {
    user: any;
    deposit: any;

    constructor(private db: AngularFireDatabase, private authService: AuthService) {
        this.user = this.authService.getUserData();
    }

    setUser(user) {
        this.user = user;
    }

    getAllDepost() {
        console.log('All deposits');
        return this.db.object('deposits/');
    }

    getDriverDeposit(key) {
        return this.db.object('deposits/' + key);
    }



    filterDeposit (key) {
        return this.db.list('deposits/', ref => ref.orderByChild('userId').equalTo(key));
    }

    filterBoda() {
        return this.db.list('charges/', ref => ref.orderByChild('ride').equalTo('Boda'));
    }
    filterCar() {
        return this.db.list('charges/', ref => ref.orderByChild('ride').equalTo('Car'));
    }

    filterDate (createdAt) {
        // return this.db.list('deposits/', ref => ref.orderByChild('userId').equalTo(userId));
        return this.db.list('deposits/', ref => ref.orderByChild('createAt').equalTo(createdAt));
    }


}
