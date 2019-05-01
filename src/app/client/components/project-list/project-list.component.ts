import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Project} from '../../models/Project';
import {HttpHelper} from '../../utils/HttpHelper';
import {Router} from '@angular/router';

const PROJECT_SERVICE_URL = '/services/project';
const PROJECT_COUNT_URL = PROJECT_SERVICE_URL + '/getUserProjectCount';
const PROJECT_APPLY_URL = PROJECT_SERVICE_URL + '/apply';

const LOGGED_IN_SERVICE_URL = '/services/login/status';

const PROJECTS_KEY = 'MY_PROJECTS';

declare let window: any;

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  @Input() filterByUser: boolean;
  @Input() viewOffline: boolean;

  projects: Project[] = [];
  projectsPerPage = 5;
  currentPage = 0;
  isMobileDevice: boolean;
  isLoggedIn: boolean;

  constructor(private httpHelper: HttpHelper,
              private router: Router) { }

  ngOnInit() {
    this.isMobileDevice = true;
    this.isLoggedIn = false;
    this.filterByUser = false;

    this.loadProjects(2);

    this.httpHelper.get(LOGGED_IN_SERVICE_URL).subscribe(res => {
      this.isLoggedIn = res.isLoggedIn;
    });

    document.addEventListener('deviceready', () => {
      this.isMobileDevice = true;

      document.addEventListener('offline', () => {
        const storage = window.localStorage;
        const serializedProjects = storage.getItem(PROJECTS_KEY);

        JSON.parse(serializedProjects).forEach(project => this.projects.push(project));
    }, false);

    }, false);
  }

  loadProjects(pages: number): void {
    for (let i = 0; i < pages; i++) {
      const page = ++this.currentPage;

      const rowStart = (page - 1) * this.projectsPerPage;
      const rowEnd = rowStart + this.projectsPerPage;
      const filterByUser = !this.filterByUser;

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
    const targetHeight = screenHeight * 8.5 / 10;

    const scrollBox = document.getElementById('scrollBox');
    scrollBox.style.height = targetHeight + 'px';
  }

  filterProjects() {
    this.currentPage = 0;
    this.projects = [];
    this.loadProjects(2);
  }

  storeProjectsOffline() {
    this.httpHelper.get(PROJECT_COUNT_URL).subscribe(countRes => {
      const userProjects = countRes.projectCount;

      const url = PROJECT_SERVICE_URL + `?rowStart=0&rowEnd=${userProjects}&filterByUser=true`;

      this.httpHelper.get(url).subscribe(projectsRes => {
        alert('hit');
        const projects = projectsRes.projects;

        const serializedProjects = JSON.stringify(projects);
        alert(serializedProjects);

        const storage = window.localStorage;
        storage.setItem(PROJECTS_KEY, serializedProjects);
      });
    });

  }
}
