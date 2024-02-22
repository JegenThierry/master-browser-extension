<template>
  <div
    :class="`${
      isActiveTask ? 'hover:bg-base-100 bg-base-200' : 'bg-base-100 hover:bg-base-200'
    } group transition-colors duration-150 flex p-2 h-full max-h-24 gap-x-4 rounded-md shadow-md`"
  >
    <div class="text-left my-auto">
      <h3 class="font-semibold text-base">{{ task.name }}</h3>
      <div class="text-xs">{{ task.description }}</div>
    </div>

    <VueIconButton
      title="Aufgabe Beenden"
      v-if="isActiveTask"
      @button-clicked="setActiveTask(undefined)"
      class="ml-auto my-auto"
      :icon="mdiStop"
    />
    <VueIconButton
      title="Aufgabe Starten"
      v-else
      @button-clicked="setActiveTask(task)"
      class="ml-auto my-auto"
      :icon="mdiPlay"
    />
  </div>
</template>

<script setup lang="ts">
import Task from '@/models/tasks/task';
import { useTaskStore } from '@/stores/taskStore';
import { computed } from 'vue';
import { Color } from '@/models/enums';
import VueIconButton from '@/components/app/VueIconButton.vue';
import { mdiPlay, mdiStop } from '@mdi/js';
import messageService from '@/services/messageService';

const props = defineProps<{ task: Task }>();
const taskStore = useTaskStore();

const isActiveTask = computed(() => taskStore.activeTask.value?.id === props.task.id);

function setActiveTask(task: Task | undefined): void {
  taskStore.setActiveTask(task);
  messageService.setActiveTask(task);
}
</script>
