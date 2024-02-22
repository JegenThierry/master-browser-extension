import {TaskType} from "./enums";

export default class Task {
    public id: number;
    public name: string;
    public description: string;
    public taskType: TaskType;

    constructor(id: number, name: string, description: string, taskType: TaskType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.taskType = taskType;
    }
}