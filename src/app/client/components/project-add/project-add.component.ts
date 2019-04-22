import { Component, Input, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {HttpHelper} from '../../utils/HttpHelper';
import {Router} from '@angular/router';

const PROJECT_SERVICE_URL = '/services/project';

const LOGGED_IN_SERVICE_URL = '/services/login/status';

const MISSING_REQUIRED_FIELDS = 'The follow are required fields: Name, Purpose';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {

  @Input() name: String;
  @Input() purpose: String;
  @Input() website: String;
  @Input() newNeed: String;
  @Input() newTool: String;

  @Input('class') nameStyle: String;
  @Input('class') purposeStyle: String;
  @Input('class') websiteStyle: String;

  needs: String[] = [];
  tools: String[] = [];

  errorMessage: string;

  constructor(private location: Location,
              private httpHelper: HttpHelper,
              private router: Router) { }

  ngOnInit() { }

  save(): void {
    this.httpHelper.get(LOGGED_IN_SERVICE_URL).subscribe(res => {
      if (res.isLoggedIn) {
        if (this.projectIsValid()) {
          this.processSave();
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  projectIsValid(): boolean {
    let isValid = true;
    this.resetStyles();

    if (!this.hasValue(this.name)) {
      this.nameStyle = 'error';
      isValid = false;
    }

    if (!this.hasValue(this.purpose)) {
      this.purposeStyle = 'error';
      isValid = false;
    }

    if (!isValid) {
      this.errorMessage = MISSING_REQUIRED_FIELDS;
    }

    return isValid;
  }

  resetStyles(): void {
    this.nameStyle = '';
    this.purposeStyle = '';
  }

  processSave(): void {
    const params = this.collectParams();

    this.httpHelper.post(PROJECT_SERVICE_URL, params).subscribe(res => {
      if (res.success) {
        this.router.navigate(['/projects']);
      } else {
        this.errorMessage = 'An error occurred while saving the project';
      }
    });
  }

  collectParams(): {} {
    return {
      name: this.name,
      purpose: this.purpose,
      website: this.website,
      needs: this.needs,
      tools: this.tools
    };
  }

  cancel(): void {
    this.location.back();
  }

  removeNeed(index: number): void {
    this.needs.splice(index, 1);
  }

  addNeed(): void {
    if (this.hasValue(this.newNeed)) {
      this.needs.push(this.newNeed);
      this.newNeed = '';
    }
  }

  hasValue(str: String): boolean {
    return str !== undefined && str !== '' && str.length > 0;
  }

  removeTool(index: number): void {
    this.tools.splice(index, 1);
  }

  addTool(): void {
    if (this.hasValue(this.newTool)) {
      this.tools.push(this.newTool);
      this.newTool = '';
    }
  }

}
