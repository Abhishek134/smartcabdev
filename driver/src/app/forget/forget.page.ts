import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {
  email;
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
  }

  reset() {
    if (this.email) {
      this.commonService.showLoader();
      this.authService.resetPassword(this.email)
        .then(data => {
          this.commonService.hideLoader();
          this.commonService.showToast('Please Check inbox')
        })
        .catch(err => {
          this.commonService.hideLoader();
          this.commonService.showToast(err.message)
        });
    }
  }
}
