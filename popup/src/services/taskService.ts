import { API_URL } from '@/models/constants';
import Task from '@/models/tasks/task';
import axios from 'axios';

import MarkingTaskData from '@/models/tasks/markingTaskData';
import ExplorationTaskData from '@/models/tasks/explorationTaskData';
import TimingTaskData from '@/models/tasks/timingTaskData';
import RatingTaskData from '@/models/tasks/ratingData';
import type SemanticTaskData from '@/models/tasks/semanticTaskData';
import ResponseMessage from '@/models/responseMessage';

class TaskService {
  /**
   * Fetches all available tasks from the server
   * @returns All available tasks
   */
  public async fetchAvailableTasks(): Promise<Task[]> {
    const url = `${API_URL}/Task`;
    const response = await axios.get(url);

    return response.data.map((task: Task) => new Task(task));
  }

  /**
   * Sends Marking Task data to the server
   * @param markingTaskData
   * @param userId
   */
  public async submitMarkingTask(markingTaskData: MarkingTaskData[], userId: string): Promise<ResponseMessage[]> {
    const url = `${API_URL}/Task/submit/markingtask/${encodeURIComponent(userId)}`;
    const res = await axios.post(url, markingTaskData);

    console.log(JSON.stringify(res.data, null, 2));
    return res.data.map((r: ResponseMessage) => new ResponseMessage(r));
  }

  /**
   * Sends Timing Task data to the server
   * @param timingTaskData
   * @param userId
   */
  public async submitTimingTask(timingTaskData: TimingTaskData, userId: string): Promise<ResponseMessage[]> {
    const url = `${API_URL}/Task/submit/timingtask/${encodeURIComponent(userId)}`;

    if (timingTaskData.timingTaskInteractions.length > 0)
      timingTaskData.websiteUrl = timingTaskData.timingTaskInteractions[0].visitedPageLink;

    const res = await axios.post(url, timingTaskData);

    return res.data.map((r: ResponseMessage) => new ResponseMessage(r));
  }

  /**
   * Sends Exploration Task data to the server
   * @param explorationTaskData
   * @param taskId
   * @param userId
   */
  public async submitExplorationTask(
    explorationTaskData: ExplorationTaskData,
    taskId: number,
    userId: string
  ): Promise<ResponseMessage[]> {
    let url = `${API_URL}/exploration`;
    url += `?taskId=${encodeURIComponent(taskId)}`;
    url += `&userId=${encodeURIComponent(userId)}`;

    if (explorationTaskData.explorationTaskInteractions.length > 0)
      explorationTaskData.endUrl =
        explorationTaskData.explorationTaskInteractions[
          explorationTaskData.explorationTaskInteractions.length - 1
        ].visitedPageLink;

    const res = await axios.post(url, explorationTaskData);

    return res.data.map((r: ResponseMessage) => new ResponseMessage(r));
  }

  /**
   * Sends Rating Task data to the server
   * @param ratingTaskData
   * @param userId
   */
  public async submitRatingTask(ratingTaskData: RatingTaskData[], userId: string): Promise<ResponseMessage[]> {
    let url = `${API_URL}/RatingTask`;
    url += `?userId=${encodeURIComponent(userId)}`;

    const res = await axios.post(url, ratingTaskData);

    return res.data.map((r: ResponseMessage) => new ResponseMessage(r));
  }

  public async submitScoutingTask(
    scoutingTaskData: SemanticTaskData[],
    userId: string,
    taskId: number
  ): Promise<ResponseMessage[]> {
    let url = `${API_URL}/ScoutingTask`;
    url += `?userId=${encodeURIComponent(userId)}`;
    url += `&taskId=${encodeURIComponent(taskId)}`;

    const finding = scoutingTaskData.length > 0 ? scoutingTaskData[0] : undefined;
    const res = await axios.post(url, finding);

    return res.data.map((r: ResponseMessage) => new ResponseMessage(r));
  }

  public async submitSemanticTask(
    semanticTaskData: SemanticTaskData[],
    userId: string,
    taskId: number
  ): Promise<ResponseMessage[]> {
    let url = `${API_URL}/SemanticTask`;
    url += `?userId=${encodeURIComponent(userId)}`;
    url += `&taskId=${encodeURIComponent(taskId)}`;

    console.log(semanticTaskData);
    const res = await axios.post(url, semanticTaskData);

    return res.data.map((r: ResponseMessage) => new ResponseMessage(r));
  }
}

export default new TaskService();
