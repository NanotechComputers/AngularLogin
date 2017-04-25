import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {ProjectDetailsComponent} from "./components/projects/project-details/project-details.component";
import {LoginComponent} from "./components/login/login.component";

let APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  }, {

    path: 'app',
    component: HomeComponent,
    //canActivate: [true], //TODO: Add Auth Guard,
    children: [{
        path: '', redirectTo: 'projects', pathMatch: 'full'
      }, {
        path: 'projects', component: ProjectsComponent
      }, {
        path: 'project/:id', component: ProjectDetailsComponent
      }]
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: '**',
    redirectTo: 'app' //TODO: Possibly add 404 page
  }
];

export let AppRouterModule = RouterModule.forRoot(APP_ROUTES, {preloadingStrategy: PreloadAllModules});
