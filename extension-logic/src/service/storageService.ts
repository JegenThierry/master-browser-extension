import Browser from "webextension-polyfill";

import Task from "../model/task";
import User from "../model/user";
import MarkingData from "../model/marks/markingData";
import TimingTaskData from "../model/timing/timingTaskData";
import ExplorationTaskData from "../model/exploration/explorationTaskData";
import SemanticData from "../model/semanticData";
import SemanticTag from "../model/semanticTag";
import RatingData from "../model/ratingData";
import MarkingTaskData from "../model/marks/markingTaskData";

class StorageService {
	public async getActiveTask(): Promise<Task | undefined> {
		const activeTaskTemp = await Browser.storage.local.get(["activeTask"]);
		if (activeTaskTemp.activeTask == undefined) return undefined;
		if (activeTaskTemp.activeTask == "undefined") return undefined;

		const activeTask = JSON.parse(activeTaskTemp.activeTask);
		return new Task(activeTask.id, activeTask.name, activeTask.description, activeTask.taskType);
	}

	public async getCurrentUser(): Promise<User | undefined> {
		const currentUserTemp = await Browser.storage.local.get(["user"]);

		if (currentUserTemp.user == undefined) return undefined;
		if (currentUserTemp.user == "undefined") return undefined;

		const user = JSON.parse(currentUserTemp.user);
		return new User(user as User);
	}

	public async getMarkingData(): Promise<MarkingData | undefined> {
		const markingDataTemp = await Browser.storage.local.get(["markingData"]);
		if (markingDataTemp.markingData == undefined) return undefined;
		if (markingDataTemp.markingData == "undefined") return undefined;

		const markingData = JSON.parse(markingDataTemp.markingData);
		return new MarkingData(markingData);
	}

	public async getTimingData(): Promise<TimingTaskData | undefined> {
		const timingTaskDataTemp = await Browser.storage.local.get(["timingTaskData"]);

		if (timingTaskDataTemp.timingTaskData == undefined) return undefined;
		if (timingTaskDataTemp.timingTaskData == "undefined") return undefined;

		const timingTaskData = JSON.parse(timingTaskDataTemp.timingTaskData);
		return new TimingTaskData(timingTaskData);
	}

	public async getExplorationData(): Promise<ExplorationTaskData | undefined> {
		const explorationDataTemp = await Browser.storage.local.get(["explorationData"]);

		if (explorationDataTemp.explorationData == undefined) return undefined;
		if (explorationDataTemp.explorationData == "undefined") return undefined;

		const explorationData = JSON.parse(explorationDataTemp.explorationData);
		return new ExplorationTaskData(explorationData.startUrl, explorationData);
	}

	public async getRatingData(): Promise<RatingData[]> {
		const ratingDataTemp = await Browser.storage.local.get(["ratingData"]);
		const ratingData = JSON.parse(ratingDataTemp.ratingData ?? "undefined");

		return ratingData.map((r: RatingData) => new RatingData(r.markId, r.userId, r.username, r.rating));
	}

	public async getSemanticData(): Promise<SemanticData | undefined> {
		const semanticDataTemp = await Browser.storage.local.get(["semanticData"]);

		if (semanticDataTemp.semanticData == undefined) return undefined;
		if (semanticDataTemp.semanticData == "undefined") return undefined;

		const semanticData = JSON.parse(semanticDataTemp.semanticData);
		return new SemanticData(undefined, semanticData);
	}

	public async getCurrentSemanticTag(): Promise<SemanticTag | undefined> {
		const semanticTagTemp = await Browser.storage.local.get(["semanticTag"]);

		if (semanticTagTemp.semanticTag == undefined) return undefined;
		if (semanticTagTemp.semanticTag == "undefined") return undefined;

		const semanticTag = JSON.parse(semanticTagTemp.semanticTag);
		return new SemanticTag(semanticTag);
	}

	public async setActiveTask(task: Task | undefined): Promise<void> {
		console.log(`Setting active Task ${JSON.stringify(task, null, 2)}`);
		if (task === undefined) {
			await Browser.storage.local.set({ activeTask: "undefined" });
		}

		await Browser.storage.local.set({ activeTask: JSON.stringify(task) });
	}

	public async setCurrentUser(user: User | undefined): Promise<void> {
		if (user === undefined) {
			await Browser.storage.local.set({ user: "undefined" });
		}

		await Browser.storage.local.set({ user: JSON.stringify(user) });
	}

	public async setMarkingData(markingData: MarkingData | undefined): Promise<void> {
		if (markingData === undefined) {
			await Browser.storage.local.set({ markingData: "undefined" });
		}

		await Browser.storage.local.set({ markingData: JSON.stringify(markingData) });
	}

	public async setTimingTaskData(timingTaskData: TimingTaskData | undefined): Promise<void> {
		if (timingTaskData === undefined) {
			await Browser.storage.local.set({ timingTaskData: "undefined" });
		}

		await Browser.storage.local.set({ timingTaskData: JSON.stringify(timingTaskData) });
	}

	public async setExplorationData(explorationData: ExplorationTaskData | undefined): Promise<void> {
		if (explorationData === undefined) {
			await Browser.storage.local.set({ explorationData: "undefined" });
		}

		await Browser.storage.local.set({ explorationData: JSON.stringify(explorationData) });
	}

	public async setRatingData(ratingData: RatingData[]): Promise<void> {
		await Browser.storage.local.set({ ratingData: JSON.stringify(ratingData) });
	}

	public async setSemanticData(semanticData: SemanticData | undefined): Promise<void> {
		if (semanticData === undefined) {
			await Browser.storage.local.set({ semanticData: "undefined" });
		}

		await Browser.storage.local.set({ semanticData: JSON.stringify(semanticData) });
	}

	public async setSemanticTag(semanticTag: SemanticTag | undefined): Promise<void> {
		if (semanticTag === undefined) {
			await Browser.storage.local.set({ semanticTag: "semanticTag" });
		}

		await Browser.storage.local.set({ semanticTag: JSON.stringify(semanticTag) });
	}

	public async addTimingTaskInteraction(clickedElement: string, visitedPageLink: string) {
		let timingData = await this.getTimingData();

		timingData?.addTimingTaskInteraction(clickedElement, visitedPageLink);
		await this.setTimingTaskData(timingData);
	}

	public async addExplorationTaskInteraction(clickedElement: string, visitedPageLink: string) {
		let explorationData = await this.getExplorationData();

		explorationData?.addExplorationTaskInteraction(clickedElement, visitedPageLink);
		await this.setExplorationData(explorationData);
	}

	public async addMarkingData(data: MarkingTaskData) {
		const markingData = await this.getMarkingData();
		markingData?.addMarkingData(data);
		await this.setMarkingData(markingData);
	}

	public async addRatingData(ratingData: RatingData) {
		const ratingDataList = await this.getRatingData();

		for (let index = 0; index < ratingDataList.length; index++) {
			const element = ratingDataList[index];

			if (element.markId == ratingData.markId) {
				element.rating = ratingData.rating;
				ratingDataList[index] = element;

				await this.setRatingData(ratingDataList);
				return;
			}
		}

		ratingDataList.push(ratingData);
		await this.setRatingData(ratingDataList);
	}

	public async addSemanticMarkingData(data: MarkingTaskData) {
		const semanticData = await this.getSemanticData();
		semanticData?.addMarkingData(data);
		await this.setSemanticData(semanticData);
	}
}

export default new StorageService();
