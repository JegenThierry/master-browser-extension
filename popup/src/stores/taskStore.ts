import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { MessageType, TaskType } from '@/models/enums';
import type Task from '@/models/tasks/task';
import taskService from '@/services/taskService';
import { useNotificationStore } from './notificationStore';
import MarkingTaskData from '@/models/tasks/markingTaskData';
import TimingTaskData from '@/models/tasks/timingTaskData';
import messageService from '@/services/messageService';
import RatingData from '@/models/tasks/ratingData';
import ExplorationTaskData from '@/models/tasks/explorationTaskData';
import type SemanticTaskData from '@/models/tasks/semanticTaskData';

const useStore = defineStore('taskstore', () => {
  const notificationStore = useNotificationStore();

  const allTasks = ref<Task[]>([]);
  const activeTask = ref<Task | undefined>(undefined);
  const activeTaskDataMarkingTask = ref<MarkingTaskData[]>([]);
  const activeTaskDataRatingTask = ref<RatingData[]>([]);
  const activeTaskDataTimingTask = ref<TimingTaskData>(new TimingTaskData());
  const activeTaskDataExplorationTask = ref<ExplorationTaskData>(new ExplorationTaskData());
  const activeTaskDataSemantic = ref<SemanticTaskData[]>([]);
  const activeTaskDataScouting = ref<SemanticTaskData[]>([]);

  function updateActiveTaskType() {
    console.log('Updating activeTask Type');
    updateActiveTaskData();
  }

  function updateActiveTaskData() {
    switch (activeTask.value?.taskType) {
      case TaskType.MarkingTask:
        messageService
          .getMarkingData()
          .then((res) => (activeTaskDataMarkingTask.value = res))
          .catch((err) => console.error(err));
        break;

      case TaskType.RatingTask:
        messageService
          .getRatingData()
          .then((res) => (activeTaskDataRatingTask.value = res))
          .catch((err) => console.error(err));
        break;

      case TaskType.TimingTask:
        messageService
          .getTimingTaskData()
          .then((res) => (activeTaskDataTimingTask.value = res))
          .catch((err) => console.error(err));
        break;

      case TaskType.ExploringTask:
        console.log('ExploringTask');
        messageService
          .getExplorationTaskData()
          .then((res) => {
            console.log(res);
            activeTaskDataExplorationTask.value = res;
          })
          .catch((err) => console.error(err));
        break;

      case TaskType.SemanticTask:
        messageService
          .getSemanticTaskData()
          .then((res) => {
            console.log(res);
            activeTaskDataSemantic.value = res;
          })
          .catch((err) => console.error(err));
        break;

      case TaskType.ScoutingTask:
        messageService
          .getScoutingTaskData()
          .then((res) => {
            console.log(res);
            activeTaskDataScouting.value = res;
          })
          .catch((err) => console.error(err));
        break;

      default:
        console.log('hhe huhu');
    }
  }

  function setActiveTask(task: Task | undefined, ignoreNotification?: boolean): void {
    activeTask.value = task;

    if (ignoreNotification) return;
    if (task) {
      notificationStore.addNotification(`${task.name} wurde gestartet.`);
      return;
    }

    notificationStore.addNotification('Aufgabe wurde abgebrochen.');
  }

  function updateAllTasks(): void {
    taskService
      .fetchAvailableTasks()
      .then((tasks) => {
        allTasks.value = tasks;
        console.log(JSON.stringify(tasks, null, 2));
      })
      .catch((err) => {
        console.error(err);
        notificationStore.addNotification('Fehler beim Laden der Aufgaben.', MessageType.Error);
      });
  }

  return {
    activeTask,
    activeTaskDataMarkingTask,
    activeTaskDataTimingTask,
    activeTaskDataRatingTask,
    allTasks,
    activeTaskDataExplorationTask,
    activeTaskDataSemantic,
    activeTaskDataScouting,
    updateActiveTaskType,
    updateActiveTaskData,
    updateAllTasks,
    setActiveTask,
  };
});

export function useTaskStore() {
  const store = useStore();
  const {
    activeTask,
    allTasks,
    activeTaskDataMarkingTask,
    activeTaskDataTimingTask,
    activeTaskDataRatingTask,
    activeTaskDataExplorationTask,
    activeTaskDataSemantic,
    activeTaskDataScouting,
  } = storeToRefs(store);
  return {
    ...store,
    activeTask,
    allTasks,
    activeTaskDataMarkingTask,
    activeTaskDataTimingTask,
    activeTaskDataRatingTask,
    activeTaskDataExplorationTask,
    activeTaskDataSemantic,
    activeTaskDataScouting,
  };
}
