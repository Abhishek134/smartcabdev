import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notification: any = {};
  notifications: any = [];

  constructor(
    private db: AngularFireDatabase,
    private cs: CommonService
  ) {

  }

  ngOnInit() {
    this.getAllMessages();
  }

  getAllMessages() {
    this.cs.showLoader();
    this.db.list('notifications').snapshotChanges().subscribe((snap: any) => {

      if (snap != null) {
        let tmp = [];
        snap.forEach(promo => {
          tmp.push({ key: promo.key, ...promo.payload.val() });
          return false;
        });
        this.notifications = tmp;
        console.log(this.notifications)
      }

      this.cs.hideLoader();
    });
  }

  add() {
    this.cs.showLoader();
    this.db.list('notifications').push(this.notification).then(() => {
      this.cs.hideLoader();
      this.cs.showToast("Notification Added into Queue");
    }).catch(() => {
      this.cs.hideLoader();
      this.cs.showToast("Something went wrong");
    })
  }

  remove(id) {
    this.cs.showLoader();
    this.db.list('notifications/' + id).remove().then(() => {
      this.cs.hideLoader();
      this.cs.showToast("Message Deleted");
    }).catch(() => {
      this.cs.hideLoader();
      this.cs.showToast("Something went wrong");
    })

  }

}
