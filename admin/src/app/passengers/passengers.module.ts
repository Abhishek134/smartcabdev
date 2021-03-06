import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PassengersPage} from './passengers.page';
import {DataTablesModule} from "angular-datatables";
import {MaterialModule} from "../material.module";

const routes: Routes = [
    {
        path: '',
        component: PassengersPage
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
    declarations: [PassengersPage]
})
export class PassengersPageModule {
}
