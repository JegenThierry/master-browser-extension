<template>
  <div id="details-container">
    <VueMarkingTaskDetails v-if="taskStore.activeTask.value?.taskType === TaskType.MarkingTask" />
    <VueRatingTaskDetails v-else-if="taskStore.activeTask.value?.taskType === TaskType.RatingTask" />
    <VueTimingTaskDetails v-else-if="taskStore.activeTask.value?.taskType === TaskType.TimingTask" />
    <VueExplorationTaskDetails v-else-if="taskStore.activeTask.value?.taskType === TaskType.ExploringTask" />
    <VueScoutingTaskDetails v-else-if="taskStore.activeTask.value?.taskType === TaskType.ScoutingTask" />
    <VueSemanticTaskDetails v-else-if="taskStore.activeTask.value?.taskType === TaskType.SemanticTask" />
    <p
      class="p-4 font-medium shadow-md rounded-md bg-indigo-50 border border-indigo-300 text-sm text-center m-2"
      v-else
    >
      Sie haben keine gestartete Aufgabe.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useTaskStore } from '@/stores/taskStore';
import { TaskType } from '@/models/enums';
import { onMounted } from 'vue';

import VueMarkingTaskDetails from '@/components/tasks/details/VueMarkingTaskDetails.vue';
import VueRatingTaskDetails from '@/components/tasks/details/VueRatingTaskDetails.vue';
import VueTimingTaskDetails from '@/components/tasks/details/VueTimingTaskDetails.vue';
import VueExplorationTaskDetails from './details/VueExplorationTaskDetails.vue';
import VueScoutingTaskDetails from './details/VueScoutingTaskDetails.vue';
import VueSemanticTaskDetails from './details/VueSemanticTaskDetails.vue';

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.updateActiveTaskType();
});
</script>
