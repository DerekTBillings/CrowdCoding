import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import {ProjectListComponent} from './client/components/project-list/project-list.component';
import {LoginComponent} from './client/components/login/login.component';
import {RegisterComponent} from './client/components/register/register.component';
import {ProjectAddComponent} from './client/components/project-add/project-add.component';
import {AboutComponent} from './client/components/about/about.component';
import {MenuComponent} from './client/components/menu/menu.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'post', component: ProjectAddComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectAddComponent,
    LoginComponent,
    AboutComponent,
    RegisterComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
