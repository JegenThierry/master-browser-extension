<template>
  <VOnboardingWrapper class="z-[90000]" ref="wrapper" :steps="steps" />

  <div class="flex flex-col pb-20">
    <div
      class="card card-compact drop-shadow-md w-auto rounded-t-none bg-base-100 shadow-xl bg-gradient-to-bl from-indigo-600 to-indigo-500 text-white border-0"
    >
      <div class="card-body">
        <h2 class="card-title flex gap-x-4 text-white">
          <img
            v-if="userStore.user.value?.profileImage == ProfileImage.Ant"
            alt="icon"
            src="/src/assets/profilePictures/Ant.webp"
            class="rounded-full w-10 h-10"
          />
          <img
            v-if="userStore.user.value?.profileImage == ProfileImage.Cat"
            alt="icon"
            src="/src/assets/profilePictures/Cat.webp"
            class="rounded-full w-10 h-10"
          />
          <img
            v-if="userStore.user.value?.profileImage == ProfileImage.Dog"
            alt="icon"
            src="/src/assets/profilePictures/Dog.webp"
            class="rounded-full w-10 h-10"
          />
          <img
            v-if="userStore.user.value?.profileImage == ProfileImage.Elephant"
            alt="icon"
            src="/src/assets/profilePictures/Elephant.webp"
            class="rounded-full w-10 h-10"
          />
          <img
            v-if="userStore.user.value?.profileImage == ProfileImage.Owl"
            alt="icon"
            src="/src/assets/profilePictures/Owl.webp"
            class="rounded-full w-10 h-10"
          />
          <img
            v-if="userStore.user.value?.profileImage == ProfileImage.Sloth"
            alt="icon"
            src="/src/assets/profilePictures/Sloth.webp"
            class="rounded-full w-10 h-10"
          />
          <span>{{ userStore.user.value?.username }}</span>
          <div title="Level 1" class="relative ml-auto">
            <VueMaterialIcon :icon="mdiDecagram" class="text-white w-8 h-8" />
            <span
              class="absolute top-1.5 left-3 text-sm inline-flex items-center font-bold text-indigo-600"
              >{{ userStore.userResources.value?.level }}</span
            >
          </div>
        </h2>
        <label class="text-xs flex text-white">
          <span class="label-text text-white">Erfahrung</span>
          <span class="ml-auto label-text text-white"
            >{{ userStore.userResources.value?.currentXp }}/{{
              userStore.userResources.value?.expUntilNextLevel
            }}</span
          >
        </label>
        <progress
          id="progress-indicator"
          class="progress progress-warning w-full -mt-1"
          :value="userStore.userResources.value?.currentXp"
          :max="userStore.userResources.value?.expUntilNextLevel"
        ></progress>
      </div>
    </div>

    <div class="pt-6 px-4 flex">
      <button id="to-game-button" @click="openGame()" class="w-full btn btn-primary">Zum Spiel</button>
    </div>

    <h2 class="p-4 pb-2 text-lg font-medium text-indigo-500">Errungenschaften</h2>
    <ul class="flex flex-col gap-y-2 p-4 pt-0">
      <!-- Display only 3 achievements -->
      <li
        v-for="(achievement, index) in gamificationStore.achievements.value"
        :id="`achievements-indicator-${index}`"
        :key="achievement.id"
      >
        <VueAchievementCard v-if="index < 3" :achievement="achievement" />
      </li>
    </ul>

    <h2 class="px-4 pb-2 -mt-2 text-lg font-medium text-indigo-500">Freischaltbares</h2>
    <ul class="flex flex-col gap-y-2 p-4 pt-0">
      <!-- Display only 3 unlockables -->
      <li
        v-for="(unlockable, index) in gamificationStore.unlockables.value"
        :id="`unlockables-indicator-${index}`"
        :key="unlockable.id"
      >
        <VueUnlockablesCard v-if="index < 3" :unlockable="unlockable" />
      </li>
    </ul>

    <button id="more-indicator" @click="openDashboard" class="btn btn-ghost text-indigo-700 px-4">
      Mehr anzeigen <VueMaterialIcon class="w-4 h-4" :icon="mdiOpenInNew" />
    </button>
  </div>
</template>

<script setup lang="ts">
import VueMaterialIcon from '@/components/VueMaterialIcon.vue';
import VueUnlockablesCard from '@/components/gamification/VueUnlockablesCard.vue';
import VueAchievementCard from '@/components/gamification/VueAchievementCard.vue';
import { useGamificationStore } from '@/stores/gamificationStore';
import { mdiDecagram, mdiOpenInNew } from '@mdi/js';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { ProfileImage } from '@/models/enums';

const gamificationStore = useGamificationStore();
const userStore = useUserStore();

import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding';
import 'v-onboarding/dist/style.css';
import { GAME_URL } from '@/models/constants';

function openDashboard() {
  window.open(`${GAME_URL}/dashboard`, '_blank');
}

function openGame() {
  window.open(`${GAME_URL}`, '_blank');
}

const steps: any = [
  {
    attachTo: { element: '#progress-indicator' },
    content: {
      title: 'Fortschritt',
      description:
        'Zeigt das erreichte Level an. Mit Level-Aufstiegen erhalten Sie Ressourcen und steigern die maximale Kapazität Ihrer Ausdauer und Mana.',
    },
  },
  {
    attachTo: { element: '#to-game-button' },
    content: {
      title: 'Das Spiel',
      description: 'Klicke auf diesen Link um die Internetseite, des Spiels zu öffnen.',
    },
  },
  {
    attachTo: { element: '#achievements-indicator-0' },
    content: {
      title: 'Errungenschaften',
      description:
        'Die Anzeige zeigt maximal drei Errungenschaften an. Dabei wird der Fortschritt sowie eine Beschreibung angezeigt, die darstellt, was für das Erreichen dieser Errungenschaft getan werden muss.',
    },
  },
  {
    attachTo: { element: '#unlockables-indicator-0' },
    content: {
      title: 'Freischaltbare Objekte',
      description:
        'Die Anzeige zeigt maximal drei Freischaltbare Objekte an. Dabei wird der Fortschritt sowie eine Beschreibung angezeigt, die darstellt, was für das erhalten dieses Objektes getan werden muss.',
    },
  },
  {
    attachTo: { element: '#more-indicator' },
    content: {
      title: 'Mehr Anzeigen',
      description:
        'Da nicht alle Errungenschaften, freischaltbaren Objekte und die Rangliste gleichzeitig angezeigt werden können, werden hier die weiteren Errungenschaften, freischaltbaren Objekte und die Rangliste angezeigt.',
    },
    on: {
      afterStep: function () {
        localStorage.setItem('completedDashboardTutorial', 'true');
      },
    },
  },
];

const wrapper = ref(null);
const { start } = useVOnboarding(wrapper);

onMounted(() => {
  gamificationStore.updateUserUnlockables();
  gamificationStore.updateUserAchievements();

  const completedDashboardTutorial = localStorage.getItem('completedDashboardTutorial');
  if (completedDashboardTutorial == 'true') return;

  setTimeout(() => {
    start();
  }, 2000);
});
</script>
