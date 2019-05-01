import { Component, OnInit } from '@angular/core';
import {HttpHelper} from '../../utils/HttpHelper';

const LOGGED_IN_SERVICE_URL = '/services/login/status';
const LOGOUT_SERVICE_URL = '/services/logout';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isSignedIn = false;

  constructor(private httpHelper: HttpHelper) { }

  ngOnInit() {
    this.checkSignInStatus();
  }

  checkSignInStatus() {
    this.httpHelper.get(LOGGED_IN_SERVICE_URL).subscribe(res => {
      this.isSignedIn = res.isLoggedIn;
      setTimeout(() => this.checkSignInStatus(), 2000);
    });
  }

  signOut() {
    this.httpHelper.get(LOGOUT_SERVICE_URL).subscribe(res => {
      this.isSignedIn = false;
    });
  }

}
