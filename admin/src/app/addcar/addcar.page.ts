import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addcar',
  templateUrl: './addcar.page.html',
  styleUrls: ['./addcar.page.scss'],
})
export class AddcarPage implements OnInit {

  car: any = {};
  isEdit = false;

  constructor(
    private db: AngularFireDatabase,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    if (this.route.snapshot.paramMap.get('id') != undefined) {
      let type = this.route.snapshot.paramMap.get('id');
      console.log(type);
      this.isEdit = true;
      this.car = this.db.object('master_settings/prices/default/vehicles/' + type).snapshotChanges().subscribe(data => {
        this.car = data.payload.val();
        this.car.key = data.key;
      });
    }
    else {
      this.isEdit = false;
    }
  }

  ngOnInit() {
  }

  add() {
    this.car.type = (this.car.name).toLowerCase().trim().split(' ').join('_');
    console.log(this.car);
    this.db.object('master_settings/prices/default/vehicles/' + this.car.type).set(this.car).then(data => {
      this.commonService.showToast("Added");
      this.location.back();
    });
  }

  update() {
    this.db.object('master_settings/prices/default/vehicles/' + this.car.key).update(this.car).then(data => {
      this.commonService.showToast("Updated");
      this.location.back();

    }).catch(err => {
      this.commonService.showToast("Something went wrong");
      console.log(err)
    });
  }

  delete() {
    this.db.object('master_settings/prices/default/vehicles/' + this.car.key).remove().then(() => {
      this.commonService.showToast("Deleted");
      this.location.back();
    }).catch(() => {
      this.commonService.showToast("Something went wrong");
    });
  }


}
