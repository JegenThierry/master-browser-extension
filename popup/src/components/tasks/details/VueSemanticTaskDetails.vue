<template>
  <div class="flex flex-col gap-y-2">
    <ul class="p-2 flex flex-col gap-y-2 h-full overflow-y-auto">
      <li v-for="marking in taskStore.activeTaskDataSemantic.value" :key="marking.id">
        <div
          class="group transition-colors duration-150 flex p-2 h-full max-h-24 gap-x-4 rounded-md shadow-md border border-indigo-700"
        >
          <div class="text-left my-auto">
            <h3 class="font-semibold text-sm">{{ getFormattedTime(marking) }}</h3>
            <p :title="marking.selectedText" class="text-xs line-clamp-3">
              {{ marking.selectedText }}
            </p>
          </div>
        </div>
      </li>
      <li
        class="rounded-md border border-yellow-300 bg-yellow-100 shadow-md p-4 text-sm font-medium text-orange-700"
        v-if="taskStore.activeTaskDataSemantic.value.length == 0"
      >
        Es wurden noch keine Textstellen markiert.
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import eventManager from '@/models/EventManager';
import { GLOBAL_EVENTS } from '@/models/constants';
import { MessageType } from '@/models/enums';
import type ResponseMessage from '@/models/responseMessage';
import type MarkingTaskData from '@/models/tasks/markingTaskData';
import router from '@/router';
import messageService from '@/services/messageService';
import taskService from '@/services/taskService';
import { useMessageStore } from '@/stores/messageStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import formatHelper from '@/utils/formatHelper';
import { onMounted, onUnmounted } from 'vue';

const notificationStore = useNotificationStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const messageStore = useMessageStore();

function getFormattedTime(data: MarkingTaskData): string {
  return formatHelper.formatDate(data.createdDate);
}

const handleSubmit = () => {
  taskService
    .submitSemanticTask(
      taskStore.activeTaskDataSemantic.value,
      userStore.user.value?.uid ?? '',
      taskStore.activeTask.value?.id ?? -1
    )
    .then((res: ResponseMessage[]) => {
      notificationStore.addNotification('Markierungen übermittelt', MessageType.Success);
      messageStore.messages.value = res;
      taskStore.setActiveTask(undefined);
      messageService.setActiveTask(undefined);

      userStore.loadUserResources();
      userStore.loadUserData();

      router.push('/');
    })
    .catch(() => notificationStore.addNotification('Markierungen konnte nicht übermittelt werden.', MessageType.Error))
    .finally(() => {
      eventManager.emit(GLOBAL_EVENTS.SUBMIT_FINISHED);
    });
};

onMounted(() => {
  eventManager.on(GLOBAL_EVENTS.SUBMIT_TASK, handleSubmit);
  taskStore.updateActiveTaskData();
});

onUnmounted(() => {
  eventManager.off(GLOBAL_EVENTS.SUBMIT_TASK, handleSubmit);
  taskStore.activeTaskDataMarkingTask.value = [];
});
</script>
