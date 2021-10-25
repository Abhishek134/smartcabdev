import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {XlPage} from './xl.page';
import {DataTablesModule} from "angular-datatables";
import {MaterialModule} from "../material.module";

const routes: Routes = [
    {
        path: '',
        component: XlPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DataTablesModule,
        MaterialModule,
        RouterModule.forChild(routes)
    ],
    declarations: [XlPage]
})
export class XlPageModule {
}
