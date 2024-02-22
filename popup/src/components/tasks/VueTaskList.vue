<template>
  <div>
    <ul id="list-elements-locations" class="p-2 flex flex-col gap-y-2 h-full overflow-y-auto">
      <li :id="`entry-${task.id}`" v-for="task in taskStore.allTasks.value" :key="task.id">
        <VueTaskEntry :task="task" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import VueTaskEntry from './VueTaskEntry.vue';
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore();
</script>
