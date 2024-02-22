<template>
  <div class="flex flex-col">
    <VueHeader>
      <template #default>Medienintermediär auswählen</template>
      <template #description>
        Wählen Sie einen der unterstützten Medienintermediären aus um eine Aufgabe zu starten.
      </template>
    </VueHeader>
    <ul class="flex flex-col gap-2 p-2 pb-20">
      <li
        v-for="(location, index) in locationStore.majorLocations.value"
        :id="`location-list-${index}`"
        @click="locationStore.selectLocation(location)"
        :key="location.name"
        class="rounded-md p-2 shadow-md group bg-white border border-indigo-200 transition-colors duration-150 flex h-full max-h-24 gap-x-4 hover:bg-indigo-50 cursor-pointer"
      >
        <div class="text-left my-auto">
          <h3 class="font-semibold text-base">
            {{ isGamePhase ? location.gameName : location.name }}
          </h3>
          <div class="text-xs">{{ location.url }}</div>
        </div>
        <VueMaterialIcon class="ml-auto w-6 h-6 text-indigo-700 my-auto" :icon="mdiArrowRight" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import VueHeader from '../fonting/VueHeader.vue';
import { useLocationStore } from '@/stores/locationStore';
import { computed, onMounted } from 'vue';
import VueMaterialIcon from '../VueMaterialIcon.vue';
import { mdiArrowRight } from '@mdi/js';
import { useUserStore } from '@/stores/userStore';
import { StudyPhase } from '@/models/enums';

const locationStore = useLocationStore();

const userStore = useUserStore();

const isGamePhase = computed(() => {
  return userStore.user.value?.phase == StudyPhase.Game;
});

onMounted(() => {
  locationStore.updateLocations();
});
</script>
