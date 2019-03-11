import {Component, HostListener, OnInit} from '@angular/core';
import {Project} from '../../models/Project';
import {HttpHelper} from '../../utils/HttpHelper';
import {Router} from '@angular/router';

const PROJECT_SERVICE_URL = '/services/project';
const PROJECT_COUNT_URL = PROJECT_SERVICE_URL + '/getProjectCount';
const PROJECT_APPLY_URL = PROJECT_SERVICE_URL + '/apply';

const LOGGED_IN_SERVICE_URL = '/services/login/status';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: Project[] = [];
  projectsPerPage = 10;
  currentPage = 0;

  constructor(private httpHelper: HttpHelper,
              private router: Router) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(): void {
    const page = ++this.currentPage;

    const rowStart = (page - 1) * this.projectsPerPage;
    const rowEnd = page * this.projectsPerPage;

    const url = PROJECT_SERVICE_URL + `?rowStart=${rowStart}&rowEnd=${rowEnd}`;

    this.httpHelper.get(url).subscribe(res => {
      this.onResize();
      res.projects.forEach(project => this.projects.push(project));
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

    this.httpHelper.post(PROJECT_APPLY_URL, params).subscribe(res => {
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

  onScroll(event: Event): void {
    const distanceFromTop = event.target['scrollTop'];
    const scrollBarHeight = event.target['offsetHeight'];
    const combinedHeight = distanceFromTop + scrollBarHeight;

    const scrollHeight = event.target['scrollHeight'];
    const dataLoadTrigger = scrollHeight * 3 / 4;

    if (combinedHeight >= dataLoadTrigger) {
      this.loadProjects();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    const screenHeight = window.innerHeight;
    const targetHeight = screenHeight * 9 / 10;

    const scrollBox = document.getElementById('scrollBox');
    scrollBox.style.height = targetHeight + 'px';
  }

}
