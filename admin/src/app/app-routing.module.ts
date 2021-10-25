import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

import {
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule,
    MatPaginatorModule, MatSelectModule, MatSortModule, MatStepperModule, MatTabsModule
} from "@angular/material";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    },
    {path: 'cars', loadChildren: './cars/cars.module#CarsPageModule'},
    {path: 'driverinfo/:id', loadChildren: './driverinfo/driverinfo.module#DriverinfoPageModule'},
    {path: 'drivers', loadChildren: './drivers/drivers.module#DriversPageModule'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'passengerinfo/:id', loadChildren: './passengerinfo/passengerinfo.module#PassengerinfoPageModule'},
    {path: 'passengers', loadChildren: './passengers/passengers.module#PassengersPageModule'},
    {path: 'promos', loadChildren: './promos/promos.module#PromosPageModule'},
    {path: 'trips', loadChildren: './trips/trips.module#TripsPageModule'},
    {path: 'withdraws', loadChildren: './withdraws/withdraws.module#WithdrawsPageModule'},
    {path: 'addcar', loadChildren: './addcar/addcar.module#AddcarPageModule'},
    {path: 'editcar/:id', loadChildren: './addcar/addcar.module#AddcarPageModule'},
    {path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule'},
    {path: 'bikes', loadChildren: './bikes/bikes.module#BikesPageModule'},
    {path: 'mini', loadChildren: './mini/mini.module#MiniPageModule'},
    {path: 'xl', loadChildren: './xl/xl.module#XlPageModule'},
    {path: 'cancelledtrips', loadChildren: './cancelledtrips/cancelledtrips.module#CancelledtripsPageModule'},
  { path: 'mbarara', loadChildren: './pages/mbarara/mbarara.module#MbararaPageModule' },
  { path: 'customer-deposit', loadChildren: './customer-deposit/customer-deposit.module#CustomerDepositPageModule' },
  { path: 'driver-deposit', loadChildren: './driver-deposit/driver-deposit.module#DriverDepositPageModule' },
  { path: 'completedtrips', loadChildren: './completedtrips/completedtrips.module#CompletedtripsPageModule' }
];

@NgModule({
    imports: [
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
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules},
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
