<template>
  <VOnboardingWrapper class="z-[90000]" ref="wrapper" :steps="steps" />

  <main>
    <VueMajorLocations v-if="locationStore.selectedLocation.value == undefined" />
    <VueSubLocations v-if="locationStore.selectedLocation.value != undefined" />
  </main>
</template>

<script setup lang="ts">
import VueMajorLocations from '@/components/locations/VueMajorLocations.vue';
import VueSubLocations from '@/components/locations/VueSubLocations.vue';
import { useLocationStore } from '@/stores/locationStore';
import { onMounted, ref } from 'vue';

import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding';
import 'v-onboarding/dist/style.css';

const locationStore = useLocationStore();

const steps: any = [
  {
    attachTo: { element: '#location-list-0' },
    content: {
      title: 'Liste der Medienintermediäre',
      description:
        'Hier finden Sie eine Liste von Medienintermediären, auf denen Aufgaben erledigt werden können. Einige Medienintermediäre verfügen möglicherweise über Unterseiten, die bereits gefundene Algorithmen und Transparenzinformationen enthalten.',
    },
    on: {
      afterStep: function () {
        localStorage.setItem('completedLocationsTutorial', 'true');
      },
    },
  },
];

const wrapper = ref(null);
const { start } = useVOnboarding(wrapper);

onMounted(() => {
  locationStore.selectLocation(undefined);

  const completedLocationsTutorial = localStorage.getItem('completedLocationsTutorial');
  if (completedLocationsTutorial == 'true') return;

  setTimeout(() => {
    start();
  }, 2000);
});
</script>
