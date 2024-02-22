<template>
  <main class="overflow-auto">
    <VueHeader>
      <template #default>{{ pageTitle }}</template>
      <template #description>Fortschritte deiner aktiven Aufgabe.</template>
    </VueHeader>

    <VueTaskDetails />

    <div class="flex flex-col gap-y-2 mt-4 pb-20 px-2">
      <VueButton
        v-if="taskStore.activeTask.value?.taskType !== undefined"
        @button-clicked="submitTaskData()"
        class="mx-auto w-full"
        :button-type="ButtonType.Primary"
        :size="Size.MD"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span> Absenden </span>
      </VueButton>
      <VueButton
        v-if="taskStore.activeTask.value !== undefined"
        @button-clicked="cancelSubmit()"
        class="mx-auto w-full"
        :button-type="ButtonType.Ghost"
        :size="Size.MD"
      >
        {{ taskStore.activeTask.value?.taskType == undefined ? 'Zurücksetzen' : 'Abbrechen' }}
      </VueButton>
      <VueButton
        v-else-if="taskStore.activeTask.value === undefined"
        @button-clicked="router.push('/locations')"
        :button-type="ButtonType.Primary"
        :size="Size.MD"
        class="mx-auto w-full"
      >
        Zu den Aufgaben
      </VueButton>
    </div>
  </main>
</template>
<script setup lang="ts">
import VueHeader from '@/components/fonting/VueHeader.vue';
import { useTaskStore } from '@/stores/taskStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import VueButton from '@/components/app/VueButton.vue';
import { ButtonType, Size } from '@/models/enums';
import eventManager from '@/models/EventManager';
import { GLOBAL_EVENTS } from '@/models/constants';
import VueTaskDetails from '@/components/tasks/VueTaskDetails.vue';
import messageService from '@/services/messageService';
import { useRouter } from 'vue-router';

const taskStore = useTaskStore();
const router = useRouter();

const isLoading = ref<boolean>(false);

const pageTitle = computed(() => {
  if (taskStore.activeTask.value) return taskStore.activeTask.value.name;

  return 'Details';
});

function submitTaskData() {
  isLoading.value = true;

  eventManager.emit(GLOBAL_EVENTS.SUBMIT_TASK);
  eventManager.emit(GLOBAL_EVENTS.CANCEL_TASK);
}

function cancelSubmit() {
  taskStore.setActiveTask(undefined);
  messageService.resetData();
}

function handleSubmitFinished() {
  isLoading.value = false;
}

onMounted(() => {
  eventManager.on(GLOBAL_EVENTS.SUBMIT_FINISHED, handleSubmitFinished);
});

onUnmounted(() => {
  eventManager.off(GLOBAL_EVENTS.SUBMIT_FINISHED, handleSubmitFinished);
});
</script>
