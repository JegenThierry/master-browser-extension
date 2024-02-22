<template>
  <div class="flex flex-col">
    <VueHeader>
      <template #default>
        <div class="flex gap-x-2 h-auto">
          <VueMaterialIcon
            @click="locationStore.selectedLocation.value = undefined"
            class="w-5 h-5 text-white hover:text-gray-100 cursor-pointer"
            :icon="mdiArrowLeft"
          />
          <div class="my-auto -mt-1">{{ pageTitle }}</div>
        </div>
      </template>
      <template #description>
        Sie können auf eine der unten aufgeführten Seiten klicken, um Aufgaben zu bearbeiten, oder eine neue Seite
        suchen.
      </template>
    </VueHeader>

    <ul class="flex flex-col gap-2 p-2 pb-20">
      <li
        v-for="subLocation in sublocations"
        :key="subLocation.id"
        @click="goToPage(subLocation.url)"
        class="rounded-md p-2 shadow-md group bg-white border border-indigo-200 transition-colors duration-150 flex h-full max-h-24 gap-x-4 hover:bg-indigo-50 cursor-pointer"
      >
        <div class="text-left my-auto overflow-hidden">
          <h3 class="font-semibold text-base">
            {{ isGamePhase ? subLocation.gameName : subLocation.name }}
          </h3>
          <div :title="subLocation.url" class="w-full text-xs truncate">{{ subLocation.url }}</div>
        </div>
      </li>
      <li class="flex w-full">
        <button @click="exploreLocation()" class="btn btn-secondary w-full">Nach einer neuen Seite suchen.</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { StudyPhase, TaskType } from '@/models/enums';
import VueHeader from '../fonting/VueHeader.vue';
import { useLocationStore } from '@/stores/locationStore';
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import VueMaterialIcon from '../VueMaterialIcon.vue';
import { mdiArrowLeft } from '@mdi/js';
import Browser from 'webextension-polyfill';
import messageService from '@/services/messageService';

const locationStore = useLocationStore();
const userStore = useUserStore();

const pageTitle = computed(() => locationStore.selectedLocation.value?.name);

const sublocations = computed(() => locationStore.subLocations.value);

const isGamePhase = computed(() => {
  return userStore.user.value?.phase == StudyPhase.Game;
});

async function exploreLocation() {
  if (locationStore.selectedLocation.value == undefined) return;
  await messageService.setActiveTaskByTaskType(TaskType.ExploringTask, locationStore.selectedLocation.value.url);
  Browser.tabs.create({ url: locationStore.selectedLocation.value.url });
}

function goToPage(url: string) {
  Browser.tabs.create({ url: url });
}
</script>
