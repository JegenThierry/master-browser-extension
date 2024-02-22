import { TaskType } from '../enums';

export default class Task {
  public id: number = 0;
  public name: string = '';
  public description: string = '';
  public taskType: TaskType = TaskType.MarkingTask;

  constructor(task?: Task) {
    if (!task) return;
    this.id = task.id;
    this.name = task.name;
    this.description = task.description;
    this.taskType = task.taskType;
  }
}
