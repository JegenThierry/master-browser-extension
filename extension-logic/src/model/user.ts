import {Phase, Teams} from "./enums";

export default class User {
    public uid: string;
    public username: string;
    public teamId: Teams;
    public phase: Phase;
    public isDone: boolean;

    constructor(user: User) {
        if (!user) {
            this.uid = "";
            this.username = "";
            this.teamId = Teams.Wizards;
            this.phase = Phase.Baseline;
            this.isDone = false;
            return;
        }

        this.uid = user.uid;
        this.username = user.username;
        this.teamId = user.teamId;
        this.phase = user.phase;
        this.isDone = user.isDone;
    }
}