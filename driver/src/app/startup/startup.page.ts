import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-startup',
    templateUrl: './startup.page.html',
    styleUrls: ['./startup.page.scss'],
})
export class StartupPage implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }


    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true
    };

}
