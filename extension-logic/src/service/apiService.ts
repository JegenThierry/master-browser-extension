import axios from "axios";
import { API_URL } from "../model/constants";
import SemanticTag from "../model/semanticTag";
import Task from "../model/task";
import MarkingTaskData from "../model/marks/markingTaskData";

class ApiService {
  public async fetchUserMarkings(userId: string, url: string): Promise<MarkingTaskData[]> {
    let apiUrl = `${API_URL}/Mark`;
    apiUrl += `?userId=${encodeURIComponent(userId)}`;
    apiUrl += `&link=${encodeURIComponent(url)}`;

    const res = await axios.get(url);
    return res.data;
  }

  public async fetchRandomTag(userId: string): Promise<SemanticTag> {
    let apiUrl = `${API_URL}/SemanticTags`;
    apiUrl += `?userId=${encodeURIComponent(userId)}`;

    const res = await fetch(apiUrl);
    const tag = await res.json();

    return new SemanticTag(tag);
  }

  public async fetchVerifiedTagIfPossible(userId: string, url: string): Promise<SemanticTag> {
    let apiUrl = `${API_URL}/SemanticTags`;
    apiUrl += `?userId=${encodeURIComponent(userId)}`;
    apiUrl += `&url=${url}`;

    const res = await fetch(apiUrl);
    const tag = await res.json();

    return new SemanticTag(tag);
  }

  public async fetchTaskByTaskType(taskType: string) {
    let apiUrl = `${API_URL}/Task/byTasktype`;
    apiUrl += `?taskType=${encodeURIComponent(taskType)}`;

    const res = await fetch(apiUrl);
    const task = await res.json();

    return new Task(task.id, task.name, task.description, task.taskType);
  }

  public async fetchSupportedUrls(): Promise<string[]> {
    let apiUrl = `${API_URL}/Url`;

    const res = await fetch(apiUrl);
    const urls = await res.json();

    return urls.map((x: any) => {
      let url = x.url;
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }
      return url;
    });
  }

  public async updateLoadFail(markId: string) {
    let apiUrl = `${API_URL}/Mark/${encodeURIComponent(markId)}`;

    await fetch(apiUrl, { method: "PUT" });
  }
}

export default new ApiService();
