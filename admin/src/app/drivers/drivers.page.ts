import {Component, OnInit} from '@angular/core';
import {CommonService} from '../services/common.service';
import {Router} from '@angular/router';
import {DriverService} from '../services/driver.service';

import {Papa} from 'ngx-papaparse';
import {File} from '@ionic-native/file/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {HttpClient} from '@angular/common/http';
import {Platform} from '@ionic/angular';

import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.page.html',
    styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {

    drivers: any = [];
    dtOptions: DataTables.Settings = {};
    showContent: any;
    category = '';
    contacts = '';
    reference = '';

    csvData: any[] = [];
    headerRow: any[] = [];

    constructor(private driverService: DriverService,
                private common: CommonService,
                private papa: Papa,
                private file: File,
                private http: HttpClient,
                private socialSharing: SocialSharing,
                private platform: Platform,
                // private plt: Platform,
                private router: Router) {

    }

    ngOnInit() {
        setTimeout(() => (this.showContent = true), 300);
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getDrivers();
    }

    getDrivers() {
        this.common.showLoader();

        this.platform.ready().then(() => {
            this.driverService.getDrivers().snapshotChanges().subscribe((snapshot: any) => {

                if (snapshot != null) {
                    let tmp = [];
                    snapshot.forEach(snap => {
                        let data = {key: snap.key, ...snap.payload.val()};
                        tmp.push(data);
                        return false;
                    });
                    this.drivers = tmp.reverse();
                    this.common.hideLoader();
                }

            }, (err) => {
                console.log(err)
            });
        });
    }

    delete(key) {
        this.driverService.deleteDriver(key).then(data => {
            this.common.showToast("Deleted");
        }).catch(err => this.common.showLoader());
    }

    changeStatus(key, status) {
        status = !status;
        this.driverService.updateDriver(key, {isApproved: status}).then(() => {
            this.common.showToast("Updated");
        }).catch(err => this.common.showToast("error"))
    }

    filterContacts() {
        this.common.showLoader();
        this.driverService.getPhoneNumber(this.contacts).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.drivers = tmp.reverse();
                console.log('Driver Contacts', this.drivers);

            }

        }, (err) => {
            console.log(err);
        });
        this.common.hideLoader();

    }



    filter() {
        this.common.showLoader();
        this.driverService.filterDrivers(this.category).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.drivers = tmp.reverse();
            }

        }, (err) => {
            console.log(err);
        });
        this.common.hideLoader();

    }



    filterReference() {
        this.common.showLoader();
        this.driverService.getReferrals(this.reference).snapshotChanges().subscribe((snapshot: any) => {

            if (snapshot != null) {
                let tmp = [];
                snapshot.forEach(snap => {
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.drivers = tmp.reverse();
                console.log('Driver Contacts', this.drivers);
            }

        }, (err) => {
            console.log(err);
        });
        this.common.hideLoader();

    }


    reset() {
        this.category = '';
        this.getDrivers();
    }

    //   ---  Print to CSV  ---

printCSV() {
        this.driverService.getDrivers().snapshotChanges().subscribe((snapshot: any) => {
            if (snapshot != null) {
                let tmp = [];
                let newdata = [];
                snapshot.forEach(snap => {
                    let x = [snap['first_name']];
                    // console.log('My XXX Data', x);
                    let data = {key: snap.key, ...snap.payload.val()};
                    tmp.push(data);
                    return false;
                });
                this.drivers = tmp.reverse();


                // Export to Excel
                // Excel Title, Header, Data
                const title = 'SMART CABS DRIVERS FOR ACTIVATION';
                const header = ['Date', 'FirstName', 'Surname', 'Email', 'Phone' ];

               var smart_cab_drivers = [];
                Object.keys(tmp).forEach(function(key) {

                    const datepipe: DatePipe = new DatePipe('en-US')
                    let datex = datepipe.transform(tmp[key].createdAt, 'MMM/dd/yyyy HH:mm:ss');
                    // var ds =

                    // console.log('testing real data',key, tmp[key]);
                    var datax = [datex , tmp[key].first_name, tmp[key].surname, tmp[key].email, tmp[key].phoneNumber];
                    console.log('testing real data new',datax );

                    smart_cab_drivers.push(datax);

                });

                const data = smart_cab_drivers;

                // Create workbook and worksheet
                const workbook = new Workbook();
                const worksheet = workbook.addWorksheet('Sharing Data');

                // Add Row and formatting
                const titleRow = worksheet.addRow([title]);
                titleRow.font = { name: 'Corbel', family: 4, size: 16, underline: 'double', bold: true };
                worksheet.addRow([]);
                const subTitleRow = worksheet.addRow(['Date : 06-09-2020']);

                worksheet.mergeCells('A1:D2');


                // Blank Row
                worksheet.addRow([]);

                // Add Header Row
                const headerRow = worksheet.addRow(header);

                // Cell Style : Fill and Border
                headerRow.eachCell((cell, number) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFF00' },
                        bgColor: { argb: 'FF0000FF' }
                    };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });

                // Add Data and Conditional Formatting
                data.forEach(d => {
                        const row = worksheet.addRow(d);
                        const qty = row.getCell(5);
                        let color = 'FF99FF99';
                        if (+qty.value < 500) {
                            color = 'FF9999';
                        }

                        qty.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: color }
                        };
                    }

                );

                worksheet.getColumn(3).width = 30;
                worksheet.getColumn(4).width = 30;
                worksheet.addRow([]);


                // Footer Row
                const footerRow = worksheet.addRow(['This is system generated excel sheet.']);
                footerRow.getCell(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFCCFFE5' }
                };
                footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                // Merge Cells
                worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

                // Generate Excel File with given name
                workbook.xlsx.writeBuffer().then((data: any) => {
                    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    fs.saveAs(blob, 'Smart Cabs.xlsx');
                });



            }
    }, (err) => {console.log(err);})}



// private extractData(res) {
//     let csvData = res || '';
//     this.papa.parse(csvData, {
//         complete: parsedData => {
//             this.headerRow = parsedData.data.splice(0, 1)[0];
//             this.csvData = parsedData.data;
//         }
//     });
// }


// exportCSV() {
//     let csv = this.papa.unparse({
//         fields: this.headerRow,
//         data: this.csvData
//     });
//
//     if (this.plt.is('cordova')) {
//         this.file.writeFile(this.file.dataDirectory, 'data.csv', csv, {replace: true}).then(res => {
//             this.socialSharing.share(null, null, res.nativeURL, null).then(e => {
//                 // Success
//             }).catch(e => {
//                 console.log('Share failed:', e)
//             });
//         }, err => {
//             console.log('Error: ', err);
//         });
//
//     } else {
//
//
//         this.driverService.getDrivers().snapshotChanges().subscribe((snapshot: any) => {
//             if (snapshot != null) {
//                 let tmp = [];
//                 let tmpheader = [];
//
//                 snapshot.forEach(snap => {
//                     let data = {key: snap.key, ...snap.payload.val()};
//                     tmp.push(data);
//
//
//                     return false;
//                 });
//                 this.drivers = tmp.reverse();
//             }
//
//         }, (err) => {
//             console.log(err)
//         });
//
//     }
// }

trackByFn(index: any,
          item: any
) {return index;}
}

