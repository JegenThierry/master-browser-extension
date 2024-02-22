import { URL_GAME } from "../constants";
import TimingTaskInteraction from "./timingTaskInteraction";

export default class TimingTaskData {
	public id: string = "";
	public websiteUrl: string = "";
	public timeInSeconds: number = 0;
	public startTime: Date = new Date();
	public timingTaskInteractions: TimingTaskInteraction[] = [];

	constructor(timingTaskData?: TimingTaskData) {
		if (!timingTaskData) return;
		this.websiteUrl = timingTaskData.websiteUrl;
		this.timeInSeconds = timingTaskData.timeInSeconds;
		this.startTime = new Date(timingTaskData.startTime);

		this.timingTaskInteractions = timingTaskData.timingTaskInteractions.map(
			(interaction) => new TimingTaskInteraction(interaction)
		);
	}

	/**
	 * The first timing task interaction added will also set websiteURL
	 * iff websiteURL is not empty.
	 */
	public addTimingTaskInteraction(clickedElement: string, visitedPageLink: string) {
		if (visitedPageLink.includes(URL_GAME)) return;
		//Timestamp set by default constructor
		const timingTaskInteraction = new TimingTaskInteraction();

		timingTaskInteraction.clickedElement = clickedElement;
		timingTaskInteraction.visitedPageLink = visitedPageLink;

		this.timingTaskInteractions.push(timingTaskInteraction);
	}

	public updateTimeInSeconds(): void {
		this.timeInSeconds = new Date().getTime() - this.startTime.getTime() / 1000; // conversion to seconds;
	}
}
