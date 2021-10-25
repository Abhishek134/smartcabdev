import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {PaymentPage} from './payment.page';
import { MomentModule } from 'angular2-moment';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path: '',
        component: PaymentPage
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
    declarations: [PaymentPage]
})
export class PaymentPageModule {
}
