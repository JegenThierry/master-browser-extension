<template>
  <div class="btm-nav drop-shadow-md bg-neutral-100">
    <VueNavbarLink
      id="location-link"
      v-page-guide="'Bietet eine Liste an Medienintermediären auf denen Aufgaben ausgeführt werden können.'"
      href="/locations"
      :icon="mdiViewListOutline"
    />
    <VueNavbarLink id="dashboard-link" v-if="hasDashboard" href="/dashboard" :icon="mdiViewDashboardOutline" />
    <VueNavbarLink
      id="task-link"
      v-page-guide="'Zeigt den aktuellen Fortschritt an sofern eine Aufgabe gestartet wurde.'"
      href="/active-task"
      :icon="mdiCheckboxMarkedCircleAutoOutline"
    />
    <VueNavbarLink id="settings-link" v-page-guide="'Einstellungen'" href="/settings" :icon="mdiCog" />
  </div>
</template>

<script lang="ts" setup>
import { mdiCog, mdiCheckboxMarkedCircleAutoOutline, mdiViewListOutline, mdiViewDashboardOutline } from '@mdi/js';
import VueNavbarLink from './app/VueNavbarLink.vue';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { StudyPhase } from '@/models/enums';

const userStore = useUserStore();

const hasDashboard = computed(() => {
  return userStore.user.value?.phase == StudyPhase.Game;
});
</script>
