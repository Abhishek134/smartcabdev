import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DepositPage } from './deposit.page';
import { MomentModule } from 'angular2-moment';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: DepositPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
      MomentModule,
      TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DepositPage]
})
export class DepositPageModule {}
