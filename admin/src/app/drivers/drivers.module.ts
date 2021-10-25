import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {DriversPage} from './drivers.page';
import {DataTablesModule} from 'angular-datatables';
import {
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule,
    MatPaginatorModule, MatSelectModule, MatSortModule, MatStepperModule, MatTabsModule
} from "@angular/material";


const routes: Routes = [
    {
        path: '',
        component: DriversPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DataTablesModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        MatStepperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule,

    ],
    declarations: [DriversPage]
})
export class DriversPageModule {
}
