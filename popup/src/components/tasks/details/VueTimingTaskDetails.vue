<template>
  <section class="flex flex-col p-2">
    <label class="text-sm font-medium">Zeit:</label>
    <div class="flex gap-x-2 mx-auto mb-4">
      <div class="text-2xl font-bold p-4 rounded-md shadow-sm text-white bg-indigo-700">
        {{ formattedDuration[0] }}
      </div>
      <div class="text-2xl font-bold p-4 rounded-md shadow-sm text-white bg-indigo-700">
        {{ formattedDuration[1] }}
      </div>
      <div class="text-2xl font-bold px-0 p-4 rounded-md shadow-sm text-indigo-700">
        {{ formattedDuration[2] }}
      </div>
      <div class="text-2xl font-bold p-4 rounded-md shadow-sm text-white bg-indigo-700">
        {{ formattedDuration[3] }}
      </div>
      <div class="text-2xl font-bold p-4 rounded-md shadow-sm text-white bg-indigo-700">
        {{ formattedDuration[4] }}
      </div>
    </div>

    <VueResourceConsumption
      v-if="userStore.user.value?.phase == StudyPhase.Game"
      :resourceType="ResourceTypes.Stamina"
      :amount="2"
      :amountOwned="userStore.userResources.value?.currentStamina ?? 0"
    />
  </section>
  <ul class="p-2 flex flex-col gap-y-2 h-full overflow-y-auto">
    <li v-for="entry in taskStore.activeTaskDataTimingTask.value.timingTaskInteractions" :key="entry.id">
      <div
        class="group transition-colors duration-150 flex p-2 max-w-[350px] h-full max-h-24 gap-x-4 rounded-md border border-indigo-300 shadow-md overflow-hidden truncate"
      >
        <div class="text-left my-auto truncate">
          <h3 class="font-semibold text-sm">{{ entry.timeStamp }}</h3>
          <p :title="entry.clickedElement" class="text-xs line-clamp-2 font-medium">{{ entry.clickedElement }}</p>
          <p :title="entry.visitedPageLink" class="text-xs truncate">{{ entry.visitedPageLink }}</p>
        </div>
      </div>
    </li>
    <li
      class="rounded-md border border-yellow-300 bg-yellow-100 shadow-md p-4 text-sm font-medium text-orange-700"
      v-if="taskStore.activeTaskDataTimingTask.value.timingTaskInteractions.length == 0"
    >
      Es wurde noch keine Seite besucht.
    </li>
  </ul>
</template>

<script setup lang="ts">
import eventManager from '@/models/EventManager';
import { GLOBAL_EVENTS } from '@/models/constants';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import formatHelper from '@/utils/formatHelper';
import { computed, onMounted, onUnmounted } from 'vue';
import TaskService from '@/services/taskService';
import { useNotificationStore } from '@/stores/notificationStore';
import { MessageType, ResourceTypes, StudyPhase } from '@/models/enums';
import { useRouter } from 'vue-router';
import messageService from '@/services/messageService';
import VueResourceConsumption from '@/components/gamification/VueResourceConsumption.vue';
import type ResponseMessage from '@/models/responseMessage';
import { useMessageStore } from '@/stores/messageStore';
const taskStore = useTaskStore();
const userStore = useUserStore();
const messageStore = useMessageStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const formattedDuration = computed(() =>
  formatHelper.formatTimeFromSeconds(taskStore.activeTaskDataTimingTask.value.timeInSeconds)
);

function updateElapsedTime(): void {
  if (taskStore.activeTaskDataTimingTask.value === undefined) return;
  taskStore.activeTaskDataTimingTask.value.updateTimeInSeconds();
  setTimeout(() => updateElapsedTime(), 1000);
}

function handleSubmit() {
  console.log(userStore.user.value);
  TaskService.submitTimingTask(taskStore.activeTaskDataTimingTask.value, userStore.user.value?.uid ?? '')
    .then((res: ResponseMessage[]) => {
      notificationStore.addNotification('Daten wurden übertragen');

      messageStore.messages.value = res;
      taskStore.setActiveTask(undefined);
      messageService.setActiveTask(undefined);

      userStore.loadUserResources();
      userStore.loadUserData();

      router.push('/');
    })
    .catch(() => {
      notificationStore.addNotification('Daten konnten nicht übertragen werden.', MessageType.Error);
    })
    .finally(() => {
      eventManager.emit(GLOBAL_EVENTS.SUBMIT_FINISHED);
    });
}

onMounted(() => {
  eventManager.on(GLOBAL_EVENTS.SUBMIT_TASK, handleSubmit);
  taskStore.updateActiveTaskData();
  updateElapsedTime();
});

onUnmounted(() => {
  eventManager.off(GLOBAL_EVENTS.SUBMIT_TASK, handleSubmit);
});
</script>
