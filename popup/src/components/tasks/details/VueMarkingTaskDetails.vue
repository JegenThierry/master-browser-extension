<template>
  <div class="flex flex-col gap-y-2">
    <VueResourceConsumption
      class="m-2"
      v-if="userStore.user.value?.phase == StudyPhase.Game"
      :resourceType="ResourceTypes.PixelDust"
      :amount="Math.floor(taskStore.activeTaskDataMarkingTask.value.length / 3) + 1"
      :amountOwned="userStore.userResources.value?.currentPixelDust ?? 0"
    />
    <ul class="p-2 flex flex-col gap-y-2 h-full overflow-y-auto">
      <li class="text-base font-medium">Markierungen:</li>
      <li v-for="entry in taskStore.activeTaskDataMarkingTask.value" :key="entry.id">
        <div
          :title="entry.contributionURL != referenceUrl ? 'Die URL stimmt nicht mit der Hauptseite überein.' : ''"
          :class="entry.contributionURL != referenceUrl ? 'border-red-700 bg-red-200' : 'border-indigo-700'"
          class="group transition-colors duration-150 flex p-2 h-full max-h-24 gap-x-4 rounded-md shadow-md border"
        >
          <div class="text-left my-auto">
            <h3 class="font-semibold text-sm">{{ getFormattedTime(entry) }}</h3>
            <p :title="entry.selectedText" class="text-xs line-clamp-3">{{ entry.selectedText }}</p>
          </div>
          <VueIconButton
            title="Eintrag entfernen"
            @button-clicked="removeMarkingTaskEntry(entry)"
            class="ml-auto my-auto"
            :icon="mdiTrashCan"
          />
        </div>
      </li>
      <li
        class="rounded-md border border-yellow-300 bg-yellow-100 shadow-md p-4 text-sm font-medium text-orange-700"
        v-if="taskStore.activeTaskDataMarkingTask.value.length == 0"
      >
        Es wurden noch keine Textstellen markiert.
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue';
import eventManager from '@/models/EventManager';
import { GLOBAL_EVENTS } from '@/models/constants';
import { useTaskStore } from '@/stores/taskStore';
import taskService from '@/services/taskService';
import { useUserStore } from '@/stores/userStore';
import formatHelper from '@/utils/formatHelper';
import type MarkingTaskData from '@/models/tasks/markingTaskData';
import VueIconButton from '@/components/app/VueIconButton.vue';
import { MessageType, ResourceTypes, StudyPhase } from '@/models/enums';
import { mdiTrashCan } from '@mdi/js';
import { useNotificationStore } from '@/stores/notificationStore';
import { useRouter } from 'vue-router';
import messageService from '@/services/messageService';
import VueResourceConsumption from '@/components/gamification/VueResourceConsumption.vue';
import { useMessageStore } from '@/stores/messageStore';
import type ResponseMessage from '@/models/responseMessage';

const taskStore = useTaskStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const messageStore = useMessageStore();
const router = useRouter();

const referenceUrl = computed(() => {
  if (taskStore.activeTaskDataMarkingTask.value.length > 0)
    return taskStore.activeTaskDataMarkingTask.value[0].contributionURL;

  return '';
});

function getFormattedTime(data: MarkingTaskData): string {
  return formatHelper.formatDate(data.createdDate);
}

function removeMarkingTaskEntry(data: MarkingTaskData): void {
  messageService.removeMarkingTaskData(data.id).then(() => {
    taskStore.activeTaskDataMarkingTask.value = taskStore.activeTaskDataMarkingTask.value.filter(
      (x) => x.id != data.id
    );
  });
}

const handleSubmit = () => {
  taskService
    .submitMarkingTask(taskStore.activeTaskDataMarkingTask.value, userStore.user.value?.uid ?? '')
    .then((res: ResponseMessage[]) => {
      notificationStore.addNotification('Markierungen übermittelt', MessageType.Success);
      taskStore.setActiveTask(undefined);
      messageService.setActiveTask(undefined);
      userStore.loadUserResources();
      messageStore.messages.value = res;

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
