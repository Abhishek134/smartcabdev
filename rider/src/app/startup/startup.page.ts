import { Component, OnInit } from '@angular/core';
import {IonicComponentService} from "../../../../driver/src/app/services/ionic-component.service";


@Component({
  selector: 'app-startup',
  templateUrl: './startup.page.html',
  styleUrls: ['./startup.page.scss'],
})
export class StartupPage implements OnInit {

    //**** toolbar for hide and show ****/
    showToolbar = false;
    showTitle = false;
    transition:boolean = false;

  constructor(
    private ionicComponentService: IonicComponentService
  ) { }

  ngOnInit() {
  }

  //********** scroll event  *************/
  onScroll($event: CustomEvent) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.transition = true;
      this.showToolbar = scrollTop >= 100;
      //console.log("showToolbar="+this.showToolbar);
      this.showTitle = scrollTop >= 100;
      //console.log("showTitle="+this.showTitle);
    }else{
      this.transition = false;
    }
  }

  toggleSideMenu() {
    this.ionicComponentService.sideMenu();
    //this.menuCtrl.toggle(); //Add this method to your button click function
  }

}
