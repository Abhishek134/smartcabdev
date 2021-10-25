import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PassengerinfoPage } from './passengerinfo.page';

const routes: Routes = [
  {
    path: '',
    component: PassengerinfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PassengerinfoPage]
})
export class PassengerinfoPageModule {}
