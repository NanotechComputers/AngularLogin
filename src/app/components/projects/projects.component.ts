import { Component, OnInit } from '@angular/core';
import {ProjectsDataLayer} from "../../store/projects.datalayer";
import {ProjectModel} from "../../models/project.model";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit {

  constructor(private datalayer: ProjectsDataLayer) { }

  public projects:Array<ProjectModel> = [];
  ngOnInit() {
    this.getProjects();
  }

  public getProjects() {
    this.datalayer.get().subscribe(x => this.projects = x, e => console.log(<any>e));
  }
}
