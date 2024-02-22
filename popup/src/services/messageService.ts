import { ChromeMessages, TaskType } from '@/models/enums';
import ExplorationTaskData from '@/models/tasks/explorationTaskData';
import MarkingTaskData from '@/models/tasks/markingTaskData';
import RatingData from '@/models/tasks/ratingData';
import type SemanticTag from '@/models/tasks/semanticTag';
import SemanticTaskData from '@/models/tasks/semanticTaskData';
import type Task from '@/models/tasks/task';
import TimingTaskData from '@/models/tasks/timingTaskData';
import User from '@/models/user';

import Browser from 'webextension-polyfill';

class MessageService {
  public async getUser(): Promise<User> {
    const response = await Browser.runtime.sendMessage({
      message: ChromeMessages.GetUser,
    });

    this.AssertIsValidResponse(response);
    return new User(response.data);
  }

  public setUser(user: User): void {
    Browser.runtime.sendMessage({ message: ChromeMessages.SetUser, data: user }).then((response) => {
      if (response.data == ChromeMessages.ResponseSuccess) console.log('Successfully set user data');
    });
  }

  public async resetData(): Promise<void> {
    Browser.runtime.sendMessage({ message: ChromeMessages.ResetData });
    Browser.runtime.sendMessage({ message: ChromeMessages.SetActiveTask, data: undefined });
  }

  public async getMarkingData(): Promise<MarkingTaskData[]> {
    interface MarkingData {
      markingTaskDataEntries: MarkingTaskData[];
    }

    const response = await Browser.runtime.sendMessage({ message: ChromeMessages.GetMarkingData });
    console.log('Get Marking Data Service', response);
    this.AssertIsValidResponse(response, true);

    return (response.data as MarkingData).markingTaskDataEntries.map(
      (entry: MarkingTaskData) => new MarkingTaskData(entry)
    );
  }

  public async getTimingTaskData(): Promise<TimingTaskData> {
    const response = await Browser.runtime.sendMessage({
      message: ChromeMessages.GetTimingTaskData,
    });
    console.log(response.data);

    return new TimingTaskData(response.data as TimingTaskData);
  }

  public async getExplorationTaskData(): Promise<ExplorationTaskData> {
    const response = await Browser.runtime.sendMessage({
      message: ChromeMessages.GetExplorationTaskData,
    });
    console.log('Exploration Task Data Response', JSON.stringify(response, null, 2));
    console.log(response.data);
    return new ExplorationTaskData(response.data as ExplorationTaskData);
  }

  public async getActiveTask(): Promise<Task | undefined> {
    const response = await Browser.runtime.sendMessage({ message: ChromeMessages.GetActiveTask });

    if (!response.activeTask) return undefined;
    return response.activeTask;
  }

  public setActiveTask(task: Task | undefined) {
    Browser.runtime
      .sendMessage({ message: ChromeMessages.SetActiveTask, data: task })
      .then((res) => console.log(res.message))
      .catch((err) => console.error(err));
  }

  public async getRatingData(): Promise<RatingData[]> {
    const response = await Browser.runtime.sendMessage({ message: ChromeMessages.GetRatingData });

    if (!response.data) return [];
    return response.data.map((rating: RatingData) => new RatingData(rating));
  }

  public async getSemanticTaskData(): Promise<SemanticTaskData[]> {
    interface SemanticData {
      markingTaskDataEntries: MarkingTaskData[];
      tag: SemanticTag;
    }

    const response = await Browser.runtime.sendMessage({ message: ChromeMessages.GetSemanticData });

    this.AssertIsValidResponse(response, true);

    return (response.data as SemanticData).markingTaskDataEntries.map(
      (entry: MarkingTaskData) => new SemanticTaskData(entry, response.data.tag)
    );
  }

  /**
   * Uses the same functionality as getSemanticTaskData, but is used for the scouting task
   * This function is used so it is easier to adjust should something change in the future
   * @returns
   */
  public async getScoutingTaskData(): Promise<SemanticTaskData[]> {
    interface SemanticData {
      markingTaskDataEntries: MarkingTaskData[];
      tag: SemanticTag;
    }

    const response = await Browser.runtime.sendMessage({ message: ChromeMessages.GetSemanticData });

    this.AssertIsValidResponse(response, true);

    return (response.data as SemanticData).markingTaskDataEntries.map(
      (entry: MarkingTaskData) => new SemanticTaskData(entry, response.data.tag)
    );
  }

  public async getExtensionId(): Promise<string> {
    const response = await Browser.runtime.sendMessage({ message: ChromeMessages.GetExtensionId });

    this.AssertIsValidResponse(response, true);
    return response.data;
  }

  public async removeMarkingTaskData(id: string): Promise<void> {
    await Browser.runtime.sendMessage({ message: ChromeMessages.RemoveMarkingTaskEntry, data: id });
  }

  public async setActiveTaskByTaskType(task: TaskType, url: string): Promise<void> {
    await Browser.runtime.sendMessage({
      message: ChromeMessages.SetActiveTaskByTaskType,
      data: { taskType: task, startUrl: url },
    });
  }

  private AssertIsValidResponse(response: any, hasDataField?: boolean) {
    if (!response) throw new Error('Response does not contain necessary information.');
    if (hasDataField && !response.data) throw new Error('Response does not contain data attribute.');
  }
}

export default new MessageService();
