import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.page.html',
  styleUrls: ['./promos.page.scss'],
})
export class PromosPage implements OnInit {
  promocodes: any = [];
  newpromocode: any = {};
  isEdit = false;
  constructor(
    private db: AngularFireDatabase,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getPromos();
  }

  getPromos() {
    this.db.list('promocodes').snapshotChanges().subscribe((snap: any) => {
      if (snap != null) {
        let tmp = [];
        snap.forEach(promo => {
          tmp.push({ key: promo.key, ...promo.payload.val() });
          return false;
        })
        this.promocodes = tmp;
      }
    })
  }

  add() {
    this.db.list('promocodes').push(this.newpromocode).then(() => {
      this.commonService.showToast("Added");
      this.reset();
    }).catch(() => {
      this.commonService.showToast("Something went wrong")
    })
  }

  edit(p) {
    this.isEdit = true;
    this.newpromocode = p;
  }

  reset() {
    this.isEdit = false;
    this.newpromocode = {};
  }

  update() {
    this.db.object('promocodes/' + this.newpromocode.key).update(this.newpromocode).then(data => {
      this.commonService.showToast("Updated");
      this.reset();
    }).catch(err => {
      this.commonService.showToast("Something went wrong")
      this.reset();
    });
  }

  delete() {
    this.db.object('promocodes/' + this.newpromocode.key).remove().then(() => {
      this.commonService.showToast("Deleted")
      this.reset();
    }).catch(() => {
      this.commonService.showToast("Something went wrong")
      this.reset();
    })
  }

}
