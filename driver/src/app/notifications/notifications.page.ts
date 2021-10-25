import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: any = [];
  isPushEnabled = false;

  constructor(
    private db: AngularFireDatabase,
    private cs: CommonService,
    private afAuth: AngularFireAuth,

  ) { }

  ngOnInit() {
    this.getAllMessages();

  }



  getAllMessages() {
    this.cs.showLoader();

    this.db.object('passengers/' + this.afAuth.auth.currentUser.uid).valueChanges().subscribe((snap: any) => {
      console.log(snap);
      if (snap.isPushEnabled != null && snap.isPushEnabled != undefined) {
        this.isPushEnabled = snap.isPushEnabled;
      }
    });

    this.db.list('notifications').snapshotChanges().subscribe((snap: any) => {

      if (snap != null) {
        let tmp = [];
        snap.forEach(n => {
          if (n.payload.val().type == 'drivers' || n.payload.val().type == 'both')
            tmp.push({ key: n.key, ...n.payload.val() });
          return false;
        });
        this.notifications = tmp;
      }

      this.cs.hideLoader();
    });
  }

}
