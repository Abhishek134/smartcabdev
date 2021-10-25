import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { TranslateModule } from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {ComplainsPage} from './complains.page';

const routes: Routes = [
    {
        path: '',
        component: ComplainsPage
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
    declarations: [ComplainsPage]
})
export class ComplainsPageModule {
}
