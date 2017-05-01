import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectDataLayer} from "../../store/project.datalayer";
import {ProjectModel} from "../../models/project.model";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: []
})
export class ProjectComponent implements OnInit {

  private projectId: number;
  public project: ProjectModel = new ProjectModel();

  constructor(private activatedRoute: ActivatedRoute, private datalayer: ProjectDataLayer) {
  }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.projectId = +params['id'];
      this.getproject(this.projectId);
    });
  }

  private getproject(id: number) {
    this.datalayer.get(id).subscribe(x => this.project = x, e => console.log(<any>e));
  }
}
