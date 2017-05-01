import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectDataLayer} from "../../store/project.datalayer";
import {ProjectModel} from "../../models/project.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: [`
  input[type=checkbox]{
    width: 16px;
    height: 16px;
    margin-top: 2px;
    margin-right: 4px;
  }
  `]
})
export class ProjectComponent implements OnInit {

  private projectId: number;
  public project: ProjectModel = new ProjectModel();
  public projectForm: FormGroup;

  constructor(private _location: Location, private activatedRoute: ActivatedRoute, private datalayer: ProjectDataLayer, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.projectId = +params['id'];
      this.getproject(this.projectId);
    });

    this.projectForm = this.formBuilder.group({
      'projectDetails': this.formBuilder.group({
        'pk': new FormControl(0, [Validators.required]),
        'title': new FormControl('', [Validators.required, Validators.minLength(5)]),
        'description': new FormControl('', [Validators.required]),
        'start_date': new FormControl('', [Validators.required]),
        'end_date': new FormControl('', [Validators.required]),
        'is_billable': new FormControl(false, [Validators.required]),
        'is_active': new FormControl(false, [Validators.required])
      })
    });
  }

  private getproject(id: number) {
    this.datalayer.get(id).subscribe(x => this.setProjectData(x), e => console.log(<any>e));
  }

  private setProjectData(data) {
    this.project = data;
    this.buildForm();
  }

  private buildForm() {
    let startDate = new Date(this.project.start_date);
    let endDate = new Date(this.project.end_date);
    this.projectForm = this.formBuilder.group({
      'projectDetails': this.formBuilder.group({
        'pk': new FormControl(this.project.pk, [Validators.required]),
        'title': new FormControl(this.project.title, [Validators.required, Validators.minLength(5)]),
        'description': new FormControl(this.project.description, [Validators.required]),
        'start_date': new FormControl(`${startDate.toISOString().substr(0, 10)}`, [Validators.required]),
        'end_date': new FormControl(`${endDate.toISOString().substr(0, 10)}`, [Validators.required]),
        'is_billable': new FormControl(this.project.is_billable, [Validators.required]),
        'is_active': new FormControl(this.project.is_active, [Validators.required])
      })
    });
  }

  cancel() {
    this._location.back();
  }

  controlValid(inputGroup, inputName) {
    let control = this.projectForm.controls[inputGroup].get(inputName);
    return control.valid;
  }

  controlTouched(inputGroup, inputName) {
    let control = this.projectForm.controls[inputGroup].get(inputName);
    return control.touched;
  }

  getFormGroupClasses(inputGroup, inputName) {
    return {
      'has-error': !this.controlValid(inputGroup, inputName),
      'has-feedback': !this.controlValid(inputGroup, inputName) && this.controlTouched(inputGroup, inputName) || this.controlValid(inputGroup, inputName),
      'has-success': this.controlValid(inputGroup, inputName)
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      let controls = this.projectForm.controls;
      let projectDetails = controls['projectDetails'].value;
      this.datalayer.update(projectDetails).subscribe(x => console.log('Success', <any>x), e => console.log('Failure', <any>e))
    }
  }
}
