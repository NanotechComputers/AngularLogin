import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {ProjectComponent} from "./components/projects/project.component";

let APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  }, {

    path: 'app',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [{
        path: '', redirectTo: 'projects', pathMatch: 'full'
      }, {
        path: 'projects', component: ProjectsComponent
      }, {
        path: 'project/:id', component: ProjectComponent
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
