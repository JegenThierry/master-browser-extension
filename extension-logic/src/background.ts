import User from "./model/user";
import { ChromeMessages, TaskType } from "./model/enums";
import { sendMessageToTab } from "./service/messageService";
import MarkingData from "./model/marks/markingData";
import Task from "./model/task";
import { FILE_PATHS } from "./model/constants";
import MarkingTaskData from "./model/marks/markingTaskData";
import TimingTaskData from "./model/timing/timingTaskData";
import SemanticTag from "./model/semanticTag";
import SemanticData from "./model/semanticData";
import apiService from "./service/apiService";
import ExplorationTaskData from "./model/exploration/explorationTaskData";
import Browser from "webextension-polyfill";
import StorageService from "./service/storageService";
import { URL_GAME } from "./model/constants";

//Information about the current Active Tab this data will reset to [] after approximately 5 minutes which is okay
let activeTabId: number = 0;
let urls: string[] = [];

async function isSupportedUrl(url: string) {
	if (url.includes("localhost")) return true;
	if (url.includes(URL_GAME)) return true;

	if (urls.length == 0) urls = await apiService.fetchSupportedUrls();

	const activeTask = await StorageService.getActiveTask();
	if (activeTask?.taskType == TaskType.ExploringTask || activeTask?.taskType == TaskType.TimingTask) return true;

	return urls.includes(url);
}

function setBadgeText(text: string) {
	// Firefox
	if (navigator.userAgent.includes("Firefox")) {
		Browser.browserAction.setBadgeText({ text }).then(() => console.log("Badge Text has been set"));
		return;
	}

	// Chrome
	Browser.action.setBadgeText({ text }).then(() => console.log("Badge Text has been set"));
}

async function resetAllData() {
	await StorageService.setExplorationData(undefined);
	await StorageService.setTimingTaskData(undefined);
	await StorageService.setMarkingData(undefined);
	await StorageService.setSemanticTag(undefined);
	await StorageService.setSemanticData(undefined);
	await StorageService.setRatingData([]);
  await StorageService.setRatingData([]);
}

async function setActiveTask(task: Task | undefined, url?: string) {
	// Update Local Storage and activeTaskType
	await StorageService.setActiveTask(task);
	await resetAllData();
	const currentUser = await StorageService.getCurrentUser();

	switch (task?.taskType) {
		case TaskType.MarkingTask: {
			await StorageService.setMarkingData(new MarkingData());
			setBadgeText("Ma");
			break;
		}
		case TaskType.TimingTask: {
			await StorageService.setTimingTaskData(new TimingTaskData());
			setBadgeText("Ti");
			break;
		}
		case TaskType.RatingTask: {
			await StorageService.setRatingData([]);
			setBadgeText("Ra");
			break;
		}
		case TaskType.SemanticTask: {
			const tab = await Browser.tabs.query({
				active: true,
				lastFocusedWindow: true,
			});
			const url = tab[0].url;
			const tag = await apiService.fetchVerifiedTagIfPossible(currentUser?.uid ?? "", url ?? "");
			await StorageService.setSemanticData(new SemanticData(tag));
			await StorageService.setSemanticTag(tag);

			setBadgeText("Se");
			break;
		}
		case TaskType.ScoutingTask: {
			const tag = await apiService.fetchRandomTag(currentUser?.uid ?? "");

			await StorageService.setSemanticData(new SemanticData(tag));
			await StorageService.setSemanticTag(tag);
			setBadgeText("Sc");
			break;
		}
		case TaskType.ExploringTask: {
			await StorageService.setExplorationData(new ExplorationTaskData(url ?? ""));
			setBadgeText("Ex");
			break;
		}
		default: {
			setBadgeText("");
		}
	}
}

/**
 * Listen to Tab Changes
 *
 * Inject script if one of two conditions holds true
 * 	- Active Task is either Timing or Exploration Task
 *  - URL is on the supported URL(Origin only check) list
 */
Browser.tabs.onUpdated.addListener(handleUpdateTab);

function isMondayTuesdayWednesday() {
	const today = new Date();
	const dayOfWeek = today.getDay();
	// Check if the day is Monday (1), Tuesday (2), or Wednesday (3)
	return dayOfWeek >= 1 && dayOfWeek <= 3;
}

async function handleUpdateTab(tabId: number, changeInfo: Browser.Tabs.OnUpdatedChangeInfoType, tab: Browser.Tabs.Tab) {
	// Validation of the current tab
	if (changeInfo.status !== "complete") return;
	if (!/^http/.test(tab.url ?? "")) return;

	let url = new URL(tab.url ?? "");

	if (changeInfo.url) {
		const newUrl = new URL(changeInfo.url);

		const tempUrl = url.toString().split("#")[0];
		const tempNewUrl = newUrl.toString().split("#")[0];

		if (tempUrl == tempNewUrl) {
			return;
		}
	}

	const isSupported = await isSupportedUrl(url.origin);
	if (!isSupported) return;
	if (isMondayTuesdayWednesday()) return;

	// Firefox
	if (navigator.userAgent.includes("Firefox")) {
		await Browser.tabs.insertCSS(tab.id, { file: FILE_PATHS.FOREGROUND_CSS });
		await Browser.tabs.executeScript(tab.id, { file: FILE_PATHS.FOREGROUND_JS });

		activeTabId = tabId;
		return;
	}

	// Chrome
	Browser.scripting
		.insertCSS({
			target: { tabId: tab.id ?? -1 },
			files: [FILE_PATHS.FOREGROUND_CSS],
		})
		.then(() => console.log("Inserted CSS"))
		.catch((err) => console.warn(err));

	Browser.scripting
		.executeScript({
			target: { tabId: tab.id ?? -1 },
			files: [FILE_PATHS.FOREGROUND_JS],
		})
		.then(() => console.log("Inserted Foregroundjs"))
		.catch((err) => console.warn(err));

	activeTabId = tabId;
}

/**
 * External chrome message event Listener, reacts to messages coming from
 * the Game Website.
 */
Browser.runtime.onMessageExternal.addListener((request, sender, sendResponse: any) => {
	(async () => {
		console.log(
			"Received Message External",
			JSON.stringify(request.data, null, 2),
			JSON.stringify(request.message, null, 2)
		);

		switch (request.message) {
			case ChromeMessages.SetActiveTask: {
				await setActiveTask(request.data);
				// Send Response to sender
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}
			case ChromeMessages.SetActiveTaskByTaskType: {
				const startUrl = request.data.startUrl;
				const taskType = request.data.taskType;
				const task = await apiService.fetchTaskByTaskType(taskType);

				await setActiveTask(task, startUrl);

				sendMessageToTab(activeTabId, ChromeMessages.SetActiveTask, task);
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}
			case ChromeMessages.GetUser: {
				const user = await StorageService.getCurrentUser();
				sendResponse({ message: ChromeMessages.ResponseSuccess, data: user });
				break;
			}
			default: {
				console.warn(`Message: ${request.message} is not supported`);
				break;
			}
		}
	})();

	return true;
});

/**
 * Listen to Messages from the Injected Script that runs on the Website.
 */
Browser.runtime.onMessage.addListener((request, _, sendResponse: any) => {
	(async () => {
		console.log("Received Message", JSON.stringify(request.data, null, 2), JSON.stringify(request.message, null, 2));

		switch (request.message) {
			case ChromeMessages.GetExtensionId: {
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: Browser.runtime.id,
				});
				break;
			}
			case ChromeMessages.SetUser: {
				const currentUser = new User(request.data);
				await StorageService.setCurrentUser(currentUser);

				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.GetUser: {
				const res = await StorageService.getCurrentUser();
				sendResponse({ message: ChromeMessages.ResponseSuccess, data: res });
				break;
			}

			case ChromeMessages.SetActiveTask: {
				await setActiveTask(request.data);
				const activeTask = await StorageService.getActiveTask();
				// Send Message to last opened Tab.

				try {
					sendMessageToTab(activeTabId, ChromeMessages.SetActiveTask, activeTask);
				} catch (error) {
					console.log(`Error sending message to tab: ${error}`);
				}
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.SetActiveTaskByTaskType: {
				console.log("SetActiveTaskByTaskType");
				console.log(request.data);
				console.log(JSON.stringify(request.data, null, 2));
				const taskType = request.data.taskType;
				const startUrl = request.data.startUrl;
				const task = await apiService.fetchTaskByTaskType(taskType);

				await setActiveTask(task, startUrl);

				sendMessageToTab(activeTabId, ChromeMessages.SetActiveTask, task);
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.GetActiveTask: {
				const res = await StorageService.getActiveTask();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					activeTask: res,
				});
				break;
			}

			case ChromeMessages.AddTimingTaskEntry: {
				if (!request.data) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				const currentActiveTask = await StorageService.getActiveTask();
				if (currentActiveTask?.taskType != TaskType.TimingTask) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				// Timing Data is defined here since setting the task defines needed elements
				await StorageService.addTimingTaskInteraction(request.data.clickedElement, request.data.visitedPageLink);
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.AddExplorationTaskEntry: {
				if (!request.data) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				const currentActiveTask = await StorageService.getActiveTask();
				if (currentActiveTask?.taskType != TaskType.ExploringTask) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				// Timing Data is defined here since setting the task defines needed elements
				await StorageService.addExplorationTaskInteraction(request.data.clickedElement, request.data.visitedPageLink);
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.GetExplorationTaskData: {
				const explorationData = await StorageService.getExplorationData();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: explorationData,
				});
				break;
			}

			case ChromeMessages.GetTimingTaskData: {
				// Timing data may be undefined here
				const timingData = await StorageService.getTimingData();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: timingData,
				});
				break;
			}

			case ChromeMessages.GetTimingTaskStartTimestamp: {
				// Timing data may be undefined here
				const timingData = await StorageService.getTimingData();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: timingData?.startTime,
				});
				break;
			}

			case ChromeMessages.AddMarkingTaskEntry: {
				if (!request.data) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				const currentActiveTask = await StorageService.getActiveTask();
				if (currentActiveTask?.taskType != TaskType.MarkingTask) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				await StorageService.addMarkingData(request.data as MarkingTaskData);
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.GetMarkingData: {
				const markingData = await StorageService.getMarkingData();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: markingData,
				});
				break;
			}

			// Remove has been temporarely disabled
			case ChromeMessages.RemoveMarkingTaskEntry: {
				if (!request.data) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				const markingData = await StorageService.getMarkingData();
				markingData?.removeById(request.data as string);

				await StorageService.setMarkingData(markingData);

				sendResponse({ message: ChromeMessages.ResponseSuccess });
				sendMessageToTab(activeTabId, ChromeMessages.RemoveMarkingTaskEntry, request.data);
				return true;
			}

			case ChromeMessages.GetRatingData: {
				const ratingData = await StorageService.getRatingData();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: ratingData,
				});
				break;
			}

			case ChromeMessages.AddRatingData: {
				if (!request.data) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				await StorageService.addRatingData(request.data);

				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}

			case ChromeMessages.GetCurrentSemanticTag: {
				const currentSemanticTag = await StorageService.getCurrentSemanticTag();

				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: currentSemanticTag,
				});
				break;
			}

			case ChromeMessages.AddMarkingToSemanticData: {
				if (!request.data) {
					sendResponse({ message: ChromeMessages.ResponseFailure });
					return;
				}

				await StorageService.addSemanticMarkingData(request.data as MarkingTaskData);
				sendResponse({ message: ChromeMessages.ResponseSuccess });
			}

			case ChromeMessages.GetSemanticData: {
				const semanticData = await StorageService.getSemanticData();
				if (!semanticData) return;

				semanticData.tag = (await StorageService.getCurrentSemanticTag()) ?? new SemanticTag();
				sendResponse({
					message: ChromeMessages.ResponseSuccess,
					data: semanticData,
				});
				break;
			}

			case ChromeMessages.ResetData: {
				await resetAllData();
				sendResponse({ message: ChromeMessages.ResponseSuccess });
				break;
			}
		}
	})();
	return true;
});
