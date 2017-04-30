import {TaskModel} from "./taskset.model";
export class ProjectModel {
  pk: number;
  title: string;
  description: string;
  start_date: any;
  end_date: any;
  is_billable: boolean;
  is_active: boolean;
  task_set: Array<TaskModel> = [];
}
