import {Component, Input, OnInit} from '@angular/core';
import {TaskModel} from "../../../models/taskset.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'project',
  templateUrl: './project-template.component.html',
  styleUrls: ['./project-template.component.css']
})
export class ProjectTemplateComponent {
  constructor(private router:Router, private route: ActivatedRoute){}

  @Input('projectItem') data: number;

  public editProject(id:number){
    //noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/app/project', id]);
  }

  public deleteProject(id:number){
    alert(`Not implemented. deleteProject(${id})`)
  }

  public setActive(id:number){
    alert(`Not implemented. setActive (${id})`)
  }

  public setBillable(id:number){
    alert(`Not implemented. setBillable(${id})`)
  }
}
