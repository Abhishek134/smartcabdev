import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {MiniPage} from './mini.page';
import {MaterialModule} from "../material.module";
import {DataTablesModule} from "angular-datatables";

const routes: Routes = [
    {
        path: '',
        component: MiniPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        DataTablesModule,
        RouterModule.forChild(routes)
    ],
    declarations: [MiniPage]
})
export class MiniPageModule {
}
