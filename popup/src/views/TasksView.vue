<template>
  <main>
    <VueHeader>
      <template #default>Aufgaben</template>
      <template #description>Eine Liste an verfügbaren Aufgaben, die erledigt werden können.</template>
    </VueHeader>
    <VueTaskList />
  </main>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/taskStore';
import { onMounted } from 'vue';
import VueTaskList from "@/components/tasks/VueTaskList.vue";
import VueHeader from "@/components/fonting/VueHeader.vue";

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.updateAllTasks();
})
</script>