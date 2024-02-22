import ExplorationTaskInteraction from "./explorationTaskInteraction";

export default class ExplorationTaskData {
	public id: string = "";
	public startUrl: string = "";
	public endUrl: string = "";
	public timeInSeconds: number = 0;
	public startTime: Date = new Date();
	public explorationTaskInteractions: ExplorationTaskInteraction[] = [];

	constructor(startUrl: string, explorationTaskData?: ExplorationTaskData) {
		this.startUrl = startUrl;

		if (!explorationTaskData) return;
		this.id = explorationTaskData.id;
		this.endUrl = explorationTaskData.endUrl;
		this.timeInSeconds = explorationTaskData.timeInSeconds;
		this.startTime = explorationTaskData.startTime;
		this.explorationTaskInteractions = explorationTaskData.explorationTaskInteractions;
	}

	/**
	 * The first timing task interaction added will also set websiteURL
	 * iff websiteURL is not empty.
	 */
	public addExplorationTaskInteraction(clickedElement: string, visitedPageLink: string) {
		//Timestamp set by default constructor
		const explorationTaskInteraction = new ExplorationTaskInteraction();

		explorationTaskInteraction.clickedElement = clickedElement;
		explorationTaskInteraction.visitedPageLink = visitedPageLink;

		this.explorationTaskInteractions.push(explorationTaskInteraction);
	}

	public updateTimeInSeconds(): void {
		this.timeInSeconds = new Date().getTime() - this.startTime.getTime() / 1000; // conversion to seconds;
	}
}
