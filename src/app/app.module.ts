import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { HomeComponent } from './components/home/home.component';
import {AppRouterModule} from "./app.routes";
import {OAuthModule} from "./services/index";
import {AuthGuard} from "./guards/auth.guard";
import {ProjectsDataLayer} from "./store/projects.datalayer";
import { ProjectTemplateComponent } from './components/shared/project-template/project-template.component';
import { ProjectComponent } from './components/projects/project.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectComponent,
    ProjectsComponent,
    HomeComponent,
    ProjectTemplateComponent
  ],
  imports: [
    AppRouterModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    OAuthModule.forRoot()
  ],
  providers: [AuthGuard,
    ProjectsDataLayer],
  bootstrap: [AppComponent]
})
export class AppModule { }
