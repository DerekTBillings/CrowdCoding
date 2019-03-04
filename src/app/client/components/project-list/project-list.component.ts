import { Component, OnInit } from '@angular/core';
import {Project} from '../../models/Project';
import {HttpHelper} from '../../utils/HttpHelper';
import {Router} from '@angular/router';

const PROJECT_SERVICE_URL = '/services/project';
const PROJECT_COUNT_URL = PROJECT_SERVICE_URL + '/getProjectCount';

const LOGGED_IN_SERVICE_URL = '/services/login/status';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: Project[];
  projectCount: number;
  projectsPerPage = 5;

  constructor(private httpHelper: HttpHelper,
              private router: Router) { }

  ngOnInit() {
    this.loadProjects(1);
  }

  getProjectCount() {
    this.httpHelper.get(PROJECT_COUNT_URL).subscribe(res => {
      this.projectCount = res.projectCount;
    });
  }

  loadProjects(page: number): void {
    const rowStart = (page - 1) * this.projectsPerPage;
    const rowEnd = page * this.projectsPerPage;

    const url = PROJECT_SERVICE_URL + `?rowStart=${rowStart}&rowEnd=${rowEnd}`;

    this.httpHelper.get(url).subscribe(res => {
      this.projects = res.projects;
    });
  }

  apply(projectId: number): void {
    this.httpHelper.get(LOGGED_IN_SERVICE_URL).subscribe(res => {
      if (res.isLoggedIn) {
        this.processApply(projectId);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  processApply(projectId: number): void {
    const params = {projectId: projectId};

    this.httpHelper.post(PROJECT_SERVICE_URL, params).subscribe(res => {
      const success = res.success;

      if (success) {
        for (const project of this.projects) {
          if (project.id === projectId) {
            project.applied = true;
          }
        }
      }
    });
  }

}
