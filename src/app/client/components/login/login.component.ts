import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HttpHelper} from '../../utils/HttpHelper';
import {MenuComponent} from '../menu/menu.component';

const LOGIN_SERVICE_URL = '/services/login/';
const INVALID_USER_PASS = 'Either the username or password was invalid!';

declare var device;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() username: string;
  @Input() password: string;

  errorMessage: string;
  menuBar: MenuComponent;

  constructor(private httpHelper: HttpHelper,
              private router: Router,
              private location: Location) { }

  ngOnInit() {
    document.addEventListener('deviceready', function() {
      alert(device.platform);
    }, false);
  }

  login(): void {
    const isValid = this.validate();

    this.errorMessage = (isValid) ? '' : INVALID_USER_PASS;

    if (isValid) {
      this.httpHelper.post(LOGIN_SERVICE_URL, this.getParams()).subscribe(res => {
        const success = res.success;
        this.password = '';

        if (!success || success === 'false') {
          this.errorMessage = INVALID_USER_PASS;
        } else {
          this.location.back();
        }
      });
    }
  }

  validate(): boolean {
    if (this.username && this.password) {
      return true;
    } else {
      return false;
    }
  }

  getParams(): any {
    return {
      username: this.username,
      password: this.password
    };
  }

}
