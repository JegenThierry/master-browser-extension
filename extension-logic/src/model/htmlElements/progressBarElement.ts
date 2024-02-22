import {Teams} from "../enums";
import PositionTuple from "../positionTuple";

export default class ProgressBarElement {
    public isMoving: boolean = false;
    public blueAmount: number = 0;
    public redAmount: number = 0;
    private position: PositionTuple = new PositionTuple(0,0);

    constructor(blueAmount: number, redAmount: number) {
        this.blueAmount = blueAmount;
        this.redAmount = redAmount;
    }

    public createProgressBar(blueAmount: number, redAmount: number) {
        const progressBar = document.createElement("div");

        const blueBar = this.createBar(Teams.Wizards);
        const redBar = this.createBar(Teams.Glitch);

        progressBar.appendChild(blueBar);
        progressBar.appendChild(redBar);

        // Apply CSS properties for the progress bar
        progressBar.style.display = "flex";
        progressBar.style.marginLeft = "auto";
        progressBar.style.marginRight = "auto";
        progressBar.style.width = "100%";
        progressBar.style.height = "20px";
        progressBar.style.border = "2px solid black";
        progressBar.style.borderRadius = "5px";

        // Apply CSS transition for the width property
        blueBar.style.transition = "width 1s ease-in-out";
        redBar.style.transition = "width 1s ease-in-out";

        // Apply CSS animation for the wave effect
        progressBar.style.animation = "wave 2s infinite linear";

        // Trigger the animation by setting the width after a short delay
        setTimeout(() => {
            blueBar.style.width = `${blueAmount}%`;
            redBar.style.width = `${redAmount}%`;
        }, 100);

        return progressBar;
    }

    updateProgressbar(){}
    displayProgressbar(){}

    private createBar(team:Teams){
        const bar = document.createElement("div");
        bar.style.width = "0";
        bar.style.height = "100%";
        bar.style.backgroundColor = this.getBorderColorForTeam(team);

        if(team == Teams.Glitch)
            bar.style.marginLeft = "auto"; // Move red bar to the right

        return bar;
    }

    private getBorderColorForTeam(team: Teams) {
        switch (team) {
            case Teams.Glitch:
                return "#FF4242";
            case Teams.Wizards:
                return "#47ABD8";
            case Teams.Neutral:
            default:
                return "black"
        }
    }
}