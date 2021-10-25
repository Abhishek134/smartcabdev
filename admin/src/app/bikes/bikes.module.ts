import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {BikesPage} from './bikes.page';
import {MaterialModule} from "../material.module";
import {DataTablesModule} from "angular-datatables";

const routes: Routes = [
    {
        path: '',
        component: BikesPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MaterialModule,
        DataTablesModule,
    ],
    declarations: [BikesPage]
})
export class BikesPageModule {
}
