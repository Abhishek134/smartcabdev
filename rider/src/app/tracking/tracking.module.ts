import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrackingPage } from './tracking.page';
import { TranslateModule } from '@ngx-translate/core';
import {SMS} from "@ionic-native/sms/ngx";

const routes: Routes = [
  {
    path: '',
    component: TrackingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
    providers: [
        SMS
    ],
  declarations: [TrackingPage]
})
export class TrackingPageModule { }
