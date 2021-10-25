import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CommonService } from '../services/common.service';
import { environment } from '../../environments/environment.prod'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  adminEmail: any = environment.adminEmail;
  constructor(
    private afAuth: AngularFireAuth,
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  login() {
    if (this.email != '' && this.password != '') {
      this.commonService.showLoader();
      this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(data => {
        this.commonService.hideLoader();
      }).catch(err => {
        this.commonService.hideLoader();
        this.commonService.showToast("Error!")
      });
    }
  }
}
