import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule,
    MatPaginatorModule, MatSelectModule, MatSortModule, MatStepperModule, MatTabsModule
} from "@angular/material";


@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        MatTabsModule,
        MatStepperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule
    ],
    exports: [
        // CommonModule,
        MatTabsModule,
        MatStepperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule
    ]

})
export class MaterialModule {
}
