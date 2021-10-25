import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {
    EMAIL_VERIFICATION_ENABLED,
    DEFAULT_AVATAR,
    DRIVER_INIT_RATING,
    DRIVER_INIT_BALANCE,
    APPROVAL_REQUIRED
} from 'src/environments/environment.prod';
import {any} from "codelyzer/util/function";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    }

    login(email, pass) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, pass);
    }

    reset(email) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    register(userInfo) {
        console.log(userInfo);
        return Observable.create(observer => {
            this.afAuth.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password).then((authData: any) => {
                // update driver object
                console.log(authData);
                userInfo.uid = authData.user.uid;
                userInfo.rating = DRIVER_INIT_RATING;
                userInfo.balance = DRIVER_INIT_BALANCE;
                userInfo.photoURL = DEFAULT_AVATAR;
                userInfo.canRide = !APPROVAL_REQUIRED;
                userInfo.isPhoneVerified = false;
                userInfo.createdAt = Date.now();
                userInfo.account_type = userInfo.transporter;
                userInfo.isApproved = false;
                userInfo.transid = userInfo.transporter + '_' + userInfo.region;
                userInfo.isAccepted = false;
                userInfo.type = userInfo.transporter.toLowerCase();
                // userInfo.myEarnings = 0;
                userInfo.commission_balance = 0;
                userInfo.cashlessEarnings = 0;
                userInfo.cashEarnings = 0;

                // var generator = require('generate-serial-number');
                // var serialNumber = generator.generate(10); // '8380289275


                var length = 8,
                    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    serialNumber='';
                for (var i = 0, n = charset.length; i < length; ++i) {
                    serialNumber += charset.charAt(Math.floor(Math.random() * n));
                }
                console.log('MY SERIAL NUMBER', serialNumber);
                if (!userInfo.serial) {
                    userInfo.serial = serialNumber;
                    userInfo.balance = parseInt(userInfo.balance) + 10000

                //    Check if reference id is in db
                //    update the driver wallet balance with 10000/=
                //     this.db.object('drivers/' + userInfo.referenceid).update(userInfo.balance=parseInt(userInfo.balance) + 10000);

                }else{

                }

                this.getUserData().updateProfile(
                    {
                        displayName: userInfo.name, photoURL: DEFAULT_AVATAR

                    }
                );

                this.db.object('drivers/' + userInfo.uid).update(userInfo);

                if (EMAIL_VERIFICATION_ENABLED === true)
                    this.getUserData().sendEmailVerification();
                observer.next();
            }).catch((error: any) => {
                if (error) {
                    observer.error(error);
                    console.log('xxxx', error)
                }
            });
        });
    }

    sendVerification() {
        this.getUserData().sendEmailVerification();
    }

    getUserData() {
        return this.afAuth.auth.currentUser;
    }

    getUser(id) {
        return this.db.object('drivers/' + id);
    }

    logout() {

        return this.afAuth.auth.signOut();   // logout from firebase
    }

    resetPassword(email) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }
}
