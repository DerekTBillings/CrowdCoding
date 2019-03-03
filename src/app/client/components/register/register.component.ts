import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {HttpHelper} from '../../utils/HttpHelper';
import {Router} from '@angular/router';

const ERROR = 'error';
const VALID = 'good';
const REGISTRATION_SERVICE_URL = '/services/registration';
const LOGIN_SERVICE_URL = '/services/login/';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  @Input() firstName: String;
  @Input() lastName: String;
  @Input() phoneNumber: String;
  @Input() email: String;
  @Input() username: String;
  @Input() password: String;
  @Input() repeatPassword: String;

  @Input('class') firstNameStyle: String;
  @Input('class') lastNameStyle: String;
  @Input('class') phoneNumberStyle: String;
  @Input('class') emailStyle: String;
  @Input('class') usernameStyle: String;
  @Input('class') passwordStyle: String;
  @Input('class') repeatPasswordStyle: String;

  errorMessage: string;

  constructor(private location: Location,
              private httpHelper: HttpHelper,
              private router: Router) { }

  ngOnInit() {
  }

  register(): void {
    const isValid = this.validateForm();

    if (isValid) {
      this.process();
    }
  }

  validateForm(): boolean {
    let isValid = true;

    isValid = this.validateNames() && isValid;
    isValid = this.validateEmail() && isValid;
    isValid = this.validatePhoneNumber() && isValid;
    isValid = this.validateUsername() && isValid;
    isValid = this.validatePassword() && isValid;

    return isValid;
  }

  validateNames(): boolean {
    let isValid = true;

    if (!this.firstName || this.firstName.length < 2) {
      this.firstNameStyle = ERROR;
      isValid = false;
    } else {
      this.firstNameStyle = VALID;
    }

    if (!this.lastName || this.lastName.length < 2) {
      this.lastNameStyle = ERROR;
      isValid = false;
    } else {
      this.lastNameStyle = VALID;
    }

    return isValid;
  }

  validateEmail(): boolean {
    const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const email = String(this.email);
    const isValid = this.email && emailValidator.test(email);

    this.emailStyle = (isValid) ? VALID : ERROR;

    return isValid;
  }

  validatePhoneNumber(): boolean {
    const phoneValidator = /^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/;

    const phoneNumber = String(this.phoneNumber);
    const isValid = this.phoneNumber && phoneValidator.test(phoneNumber);

    this.phoneNumberStyle = (isValid) ? VALID : ERROR;

    return isValid;
  }

  validateUsername(): boolean {
    if (!this.username || this.username.length < 4) {
      this.usernameStyle = ERROR;
      return false;
    } else {
      this.usernameStyle = VALID;
      return true;
    }
  }

  isUsernameValid(): boolean {
    if (!this.username || this.username.length < 4) {
      this.usernameStyle = ERROR;
      return false;
    } else {
      this.usernameStyle = VALID;
      return true;
    }
  }

  validatePassword(): boolean {
    let isValid = false;

    const password = this.password;
    const repeatPassword = this.repeatPassword;

    if (!password || password.length < 4) {
      this.passwordStyle = ERROR;
      this.passwordStyle = ERROR;
    } else if (!repeatPassword || password !== repeatPassword) {
      this.repeatPasswordStyle = ERROR;
    } else {
      this.passwordStyle = VALID;
      this.repeatPasswordStyle = VALID;
      isValid = true;
    }

    return isValid;
  }

  managePhoneNumber(): void {
    this.phoneNumber = this.phoneNumber.replace(/\D+/g, '');
    const phoneComponents = this.phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (phoneComponents) {
      this.phoneNumber = '(' + phoneComponents[1] + ') ' + phoneComponents[2] + '-' + phoneComponents[3];
    }
  }

  process(): void {
    const url = REGISTRATION_SERVICE_URL + `?username=${this.username}`;

    this.httpHelper.get(url).subscribe(res => {
      const isUsernameUnique = res.isUnique;

      if (!isUsernameUnique || isUsernameUnique === 'false') {
        this.errorMessage = 'The username provided is already in use.';
      } else {
        this.processRegistration();
      }
    });
  }

  processRegistration(): void {
    this.httpHelper.post(REGISTRATION_SERVICE_URL, this.getParams()).subscribe(registrationRes => {
      const isSuccess = registrationRes.success;

      if (isSuccess) {
        const params = {username: this.username, password: this.password};

        this.httpHelper.post(LOGIN_SERVICE_URL, params).subscribe(loginRes => {
          this.router.navigate(['/projects']);
        });
      }
    });
  }

  getParams(): any {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      username: this.username,
      password: this.password
    };
  }

  back(): void {
    this.location.back();
  }

}
