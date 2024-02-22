import { ChromeMessages, TaskType } from "../model/enums";
import User from "../model/user";
import Task from "../model/task";
import MarkingTaskData from "../model/marks/markingTaskData";
import RatingData from "../model/ratingData";
import SemanticTag from "../model/semanticTag";

import Browser from "webextension-polyfill";

class MessageService {
	public async pushMarkingData(markingTaskDataEntry: MarkingTaskData): Promise<boolean> {
		const response = await Browser.runtime.sendMessage({
			message: ChromeMessages.AddMarkingTaskEntry,
			data: markingTaskDataEntry,
		});

		if (response.message !== ChromeMessages.ResponseSuccess) {
			console.error("Sending Marking Task data failed.");
			return false;
		}

		return true;
	}

	public async pushSemanticData(markingTaskDataEntry: MarkingTaskData): Promise<boolean> {
		const response = await Browser.runtime.sendMessage({
			message: ChromeMessages.AddMarkingToSemanticData,
			data: markingTaskDataEntry,
		});

		if (response.message !== ChromeMessages.ResponseSuccess) {
			console.error("Sending Marking Task data failed.");
			return false;
		}

		return true;
	}

	public async getUser(): Promise<User> {
		const response = await Browser.runtime.sendMessage({
			message: ChromeMessages.GetUser,
		});
		AssertIsValidResponse(response);
		return new User(response.data);
	}

	public async getExtensionId(): Promise<string> {
		const response = await Browser.runtime.sendMessage({
			message: ChromeMessages.GetExtensionId,
		});
		AssertIsValidResponse(response);
		return response.data as string;
	}

	public async getActiveTask(): Promise<Task | undefined> {
		const response = await Browser.runtime.sendMessage({
			message: ChromeMessages.GetActiveTask,
		});

		AssertIsValidResponse(response);

		if (!response.activeTask) return undefined;
		return new Task(
			response.activeTask.id,
			response.activeTask.name,
			response.activeTask.description,
			response.activeTask.taskType
		);
	}

	public async addRatingData(ratingData: RatingData): Promise<void> {
		Browser.runtime.sendMessage({
			message: ChromeMessages.AddRatingData,
			data: ratingData,
		});
	}

	public async getCurrentSemanticTag(): Promise<SemanticTag> {
		const res = await Browser.runtime.sendMessage({
			message: ChromeMessages.GetCurrentSemanticTag,
		});

		return new SemanticTag(res.data);
	}

	public async setActiveTaskByTaskType(taskType: TaskType, startUrl?: string) {
		await Browser.runtime.sendMessage({
			message: ChromeMessages.SetActiveTaskByTaskType,
			data: { taskType: taskType, startUrl: startUrl ?? "" },
		});

		return;
	}

	public sendLinkForExplorationTask(clickedElement: string, visitedPageLink: string) {
		Browser.runtime
			.sendMessage({
				message: ChromeMessages.AddExplorationTaskEntry,
				data: {
					clickedElement,
					visitedPageLink,
				},
			})
			.then(() => console.log("Success"))
			.catch((err) => console.error(err));
	}

	public async resetAllData(): Promise<void> {
		await Browser.runtime.sendMessage({ message: ChromeMessages.ResetData });
	}

	public async removeMarkingDataById(id: string) {
		await Browser.runtime.sendMessage({ message: ChromeMessages.RemoveMarkingTaskEntry, data: id });
	}
}

export const getTimer = async (): Promise<Date> => {
	const response = await Browser.runtime.sendMessage({
		message: ChromeMessages.GetTimingTaskStartTimestamp,
	});
	AssertIsValidResponse(response, true);

	const { startTimer } = response.data;
	return new Date(startTimer);
};

export const sendLinkForTimingTask = (clickedElement: string, visitedPageLink: string) => {
	Browser.runtime
		.sendMessage({
			message: ChromeMessages.AddTimingTaskEntry,
			data: {
				clickedElement,
				visitedPageLink,
			},
		})
		.then(() => console.log("Success"))
		.catch((err) => console.error(err));
};

export const sendMessageToTab = (tabId: number, messageType: ChromeMessages, data: any) => {
	Browser.tabs
		.sendMessage(tabId, {
			message: messageType,
			data: data,
		})
		.then(() => console.log(`Success Sending Message: ${messageType} to Tab: ${tabId}`));
};

function AssertIsValidResponse(response: any, hasDataField?: boolean) {
	if (!response) throw new Error("Response does not contain necessary information.");
	if (hasDataField && !response.data) throw new Error("Response does not contain data attribute.");
}

export default new MessageService();
