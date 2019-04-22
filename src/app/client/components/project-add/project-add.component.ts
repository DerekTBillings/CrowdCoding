import { Component, Input, OnInit } from '@angular/core';
import {Location} from '@angular/common';

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
  @Input('class') newNeedStyle: String;
  @Input('class') newToolStyle: String;

  needs: String[] = [];
  tools: String[] = [];

  errorMessage: string;

  constructor(private location: Location) { }

  ngOnInit() {
  }

  save(): void {

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
