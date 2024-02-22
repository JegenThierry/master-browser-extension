<template>
  <div class="flex flex-col gap-y-2">
    <VueResourceConsumption
      class="m-2"
      v-if="userStore.user.value?.phase == StudyPhase.Game"
      :resourceType="ResourceTypes.Mana"
      :amount="taskStore.activeTaskDataRatingTask.value.length"
      :amountOwned="userStore.userResources.value?.currentMana ?? 0"
    />
    <ul class="p-2 flex flex-col gap-y-2 h-full overflow-y-auto">
      <li v-for="(entry, index) in taskStore.activeTaskDataRatingTask.value" :key="entry.markId">
        <div
          class="group transition-colors duration-150 flex p-2 h-full max-h-24 gap-x-4 rounded-md shadow-md border border-indigo-700"
        >
          <div class="text-left my-auto">
            <h3 class="font-semibold text-sm">Bewertung von: {{ entry.rating }}</h3>
            <p :title="entry.markId" class="text-xs line-clamp-3">Für die Markierung: {{ entry.markId }}</p>
          </div>
          <VueIconButton
            title="Eintrag entfernen (Dies gilt nur für die Daten die an den Server gesendet werden.)"
            @button-clicked="removeRatingFromSubmit(index)"
            class="ml-auto my-auto"
            :icon="mdiTrashCan"
          />
        </div>
      </li>
      <li
        class="rounded-md border border-yellow-300 bg-yellow-100 shadow-md p-4 text-sm font-medium text-orange-700"
        v-if="taskStore.activeTaskDataRatingTask.value.length == 0"
      >
        Es wurden noch keine Bewertungen vorgenommen.
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { GLOBAL_EVENTS } from '@/models/constants';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import { MessageType, ResourceTypes, StudyPhase } from '@/models/enums';
import { mdiTrashCan } from '@mdi/js';

import eventManager from '@/models/EventManager';
import taskService from '@/services/taskService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useRouter } from 'vue-router';
import messageService from '@/services/messageService';
import VueResourceConsumption from '@/components/gamification/VueResourceConsumption.vue';
import { useMessageStore } from '@/stores/messageStore';
import type ResponseMessage from '@/models/responseMessage';
import VueIconButton from '@/components/app/VueIconButton.vue';

const taskStore = useTaskStore();
const userStore = useUserStore();
const messsageStore = useMessageStore();
const notificationStore = useNotificationStore();
const router = useRouter();

function handleSubmit() {
  const userId = userStore.user.value?.uid ?? '';
  const ratingTaskData = taskStore.activeTaskDataRatingTask.value;

  taskService
    .submitRatingTask(ratingTaskData, userId)
    .then((res: ResponseMessage[]) => {
      notificationStore.addNotification('Bewertungen übermittelt', MessageType.Success);
      taskStore.setActiveTask(undefined);
      messsageStore.messages.value = res;
      messageService.setActiveTask(undefined);

      userStore.loadUserResources();
      userStore.loadUserData();

      router.push('/');
    })
    .catch(() => notificationStore.addNotification('Bewerung konnte nicht übermittelt werden.', MessageType.Error))
    .finally(() => {
      eventManager.emit(GLOBAL_EVENTS.SUBMIT_FINISHED);
    });

  console.log('Submit me daddy');
}

function removeRatingFromSubmit(index: number) {
  taskStore.activeTaskDataRatingTask.value.splice(index, 1);
}

onMounted(() => {
  eventManager.on(GLOBAL_EVENTS.SUBMIT_TASK, handleSubmit);
  taskStore.updateActiveTaskData();
});

onUnmounted(() => {
  eventManager.off(GLOBAL_EVENTS.SUBMIT_TASK, handleSubmit);
  taskStore.activeTaskDataMarkingTask.value = [];
});
</script>
