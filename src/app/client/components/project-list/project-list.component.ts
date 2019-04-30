import {Component, HostListener, Input, OnInit} from '@angular/core';
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
  projectsPerPage = 5;
  currentPage = 0;
  isMobileDevice: false;
  isLoggedIn: false;
  filterByUser: boolean;
  storeOffline: boolean;

  @Input() storeOfflineButton: HTMLButtonElement;
  @Input() filterProjectsButton: HTMLButtonElement;

  constructor(private httpHelper: HttpHelper,
              private router: Router) { }

  ngOnInit() {
    this.loadProjects(2);

    this.httpHelper.get(LOGGED_IN_SERVICE_URL).subscribe(res => {
      this.isLoggedIn = res.isLoggedIn;
    });

    document.addEventListener('deviceready', function() {
      this.isMobileDevice = true;
    }, false);

  }

  loadProjects(pages: number): void {
    for (let i = 0; i < pages; i++) {
      const page = ++this.currentPage;

      const rowStart = (page - 1) * this.projectsPerPage;
      const rowEnd = page * this.projectsPerPage;
      const filterByUser = this.filterByUser;

      const url = PROJECT_SERVICE_URL + `?rowStart=${rowStart}&rowEnd=${rowEnd}&filterByUser=${filterByUser}`;

      this.httpHelper.get(url).subscribe(res => {
        this.onResize();
        res.projects.forEach(project => this.projects.push(project));
      });
    }
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
      this.loadProjects(1);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    const screenHeight = window.innerHeight;
    const targetHeight = screenHeight * 9 / 10;

    const scrollBox = document.getElementById('scrollBox');
    scrollBox.style.height = targetHeight + 'px';
  }

  filterProjects(event: Event) {
    this.filterByUser = this.isEventCallerPressed(event);

    this.currentPage = 0;
    this.projects = [];
    this.loadProjects(2);
  }

  isEventCallerPressed(event: Event) {
    const target = this.getTarget(event);
    console.log(target);

    return target.attributes['aria-pressed'].nodeValue;
  }

  getTarget(event: Event): any {
    return event.target || event.currentTarget;
  }

  storeProjectsOffline(event: Event) {
    this.storeOffline = this.isEventCallerPressed(event);
  }
}
