import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {HomePage} from './home.page';
import {MaterialModule} from "../material.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
        MaterialModule,
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
