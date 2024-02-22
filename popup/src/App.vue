<template>
  <div class="relative">
    <VOnboardingWrapper
      class="z-[90000]"
      ref="wrapper"
      :steps="userStore.user.value?.phase == StudyPhase.Game ? stepsGame : steps"
    />

    <ResponseMessageModal
      v-if="messages.length > 0"
      @close-modal="messageStore.messages.value = []"
      :response-messages="messages"
    />

    <NotificationMessageModal
      v-if="messageStore.notifications.value.length > 0"
      @close-modal="messageStore.notifications.value = []"
      :notifications="messageStore.notifications.value"
    />

    <RouterView />

    <VueNotification
      class="fixed left-[8.333%] w-5/6"
      v-for="(notification, index) in notificationStore.notifications.value"
      :style="getNotificationStyle(index)"
      :key="notification.message"
      :messageType="notification.messageType"
      :message="notification.message"
    />

    <VueNavbar v-if="isNavbarVisible" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import VueNavbar from '@/components/VueNavbar.vue';
import { useUserStore } from '@/stores/userStore';
import { StudyPhase } from './models/enums';
import { useNotificationStore } from '@/stores/notificationStore';
import VueNotification from '@/components/app/VueNotification.vue';
import messageService from './services/messageService';
import QuestionnaireService from '@/services/questionnaireService';
import { useTaskStore } from './stores/taskStore';
import type Task from './models/tasks/task';
import userService from './services/userService';
import User from './models/user';
import { useMessageStore } from './stores/messageStore';
import ResponseMessageModal from './components/modals/ResponseMessageModal.vue';
import NotificationMessageModal from './components/modals/NotificationMessageModal.vue';

import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding';
import 'v-onboarding/dist/style.css';

const router = useRouter();
const userStore = useUserStore();

const notificationStore = useNotificationStore();
const taskStore = useTaskStore();
const messageStore = useMessageStore();

const messages = computed(() => messageStore.messages.value);

const isNavbarVisible = computed(() => {
  const route = router.currentRoute.value.name?.toString();

  if (route?.includes('create')) return false;
  if (route?.includes('update-username')) return false;
  return !route?.includes('new-questionnaire');
});

function getNotificationStyle(index: number) {
  const distanceFromBottom = 56 * (notificationStore.notifications.value.length - 1 - index) + 72;
  return { bottom: `${distanceFromBottom}px` };
}

function isMondayTuesdayWednesday() {
  return false;
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   // Check if the day is Monday (1), Tuesday (2), or Wednesday (3)
//   return dayOfWeek >= 1 && dayOfWeek <= 3;
}

const steps: any = [
  {
    attachTo: { element: '#location-link' },
    content: {
      title: 'Medienintermediäre',
      description: 'Unter diesem Menüpunkt finden Sie eine Liste der unterstützten Medienintermediäre.',
    },
  },
  {
    attachTo: { element: '#task-link' },
    content: {
      title: 'Aufgaben Fortschritt',
      description:
        'Der Fortschritt der aktuellen Aufgabe sowie die Möglichkeit, eine Aufgabe abzuschließen, befinden sich unter diesem Menüpunkt.',
    },
  },
  {
    attachTo: { element: '#settings-link' },
    content: {
      title: 'Einstellungen',
      description:
        'Allgemeine Informationen und die Option, die Studie abzubrechen, befinden sich auf der Einstellungsseite.',
    },
  },
  {
    attachTo: { element: '#details-container' },
    content: {
      title: 'Details',
      description:
        'Hier werden je nach Aufgabe spezifische Details angezeigt. Jede gestartete Aufgabe kann hier abgegeben, abgebrochen oder bearbeitet werden.',
    },
    on: {
      afterStep: function () {
        localStorage.setItem('completedProgressTutorial', 'true');
      },
    },
  },
];

const stepsGame: any = [
  {
    attachTo: { element: '#location-link' },
    content: {
      title: 'Medienintermediäre',
      description: 'Unter diesem Menüpunkt finden Sie eine Liste der unterstützten Medienintermediäre.',
    },
  },
  {
    attachTo: { element: '#dashboard-link' },
    content: {
      title: 'Dashboard und Spiel',
      description: 'Unter diesem Menüpunkt finden Sie eine Liste an Spielelementen sowie ein Link zu der Spielseite.',
    },
  },
  {
    attachTo: { element: '#task-link' },
    content: {
      title: 'Aufgaben Fortschritt',
      description:
        'Der Fortschritt der aktuellen Aufgabe sowie die Möglichkeit, eine Aufgabe abzuschließen, befinden sich unter diesem Menüpunkt.',
    },
  },
  {
    attachTo: { element: '#settings-link' },
    content: {
      title: 'Einstellungen',
      description:
        'Allgemeine Informationen und die Option, die Studie abzubrechen, befinden sich auf der Einstellungsseite.',
    },
  },
  {
    attachTo: { element: '#details-container' },
    content: {
      title: 'Details',
      description:
        'Hier werden je nach Aufgabe spezifische Details angezeigt. Jede gestartete Aufgabe kann hier abgegeben, abgebrochen oder bearbeitet werden.',
    },
    on: {
      afterStep: function () {
        localStorage.setItem('completedProgressTutorialGame', 'true');
      },
    },
  },
];

const wrapper = ref(null);

const { start } = useVOnboarding(wrapper);

onMounted(async () => {
  // Check fo active Task
  messageService
    .getActiveTask()
    .then((res: Task | undefined) => taskStore.setActiveTask(res, true))
    .catch((err) => console.error(err));

  const hasUserAccount = await userStore.loadData();

  if (!hasUserAccount) {
    await router.push('/create');
    return;
  }

  let userRequestResult = undefined;
  try {
    userRequestResult = await userService.fetchUser(userStore.user.value?.uid ?? '');
  } catch (error) {
    console.error(error);
  }

  if (!(userRequestResult instanceof User)) {
    router.push('/create');
    return;
  }

  userStore.user.value = userRequestResult;
  messageStore.updateUserNotifications(userRequestResult.uid);

  messageService.setUser(userRequestResult);

  const hasUncompletedQuestionnaire = await QuestionnaireService.hasUnansweredQuestionnaireGroup(userRequestResult.uid);

  if (hasUncompletedQuestionnaire || isMondayTuesdayWednesday()) {
    router.push('/new-questionnaire');
    return;
  }

  if (userStore.user.value.phase == StudyPhase.Game && userStore.user.value?.username === userStore.user.value?.uid) {
    router.push('/update-username');
    return;
  }

  if (taskStore.activeTask !== undefined) {
    await router.push('/active-task');

    setTimeout(() => {
      console.log(
        JSON.stringify(userStore.user.value, null, 2),
        ' and phase is game: ',
        userStore.user.value?.phase == StudyPhase.Game
      );
      if (userStore.user.value?.phase == StudyPhase.Game) {
        const completedProgressTutorialGame = localStorage.getItem('completedProgressTutorialGame');
        if (completedProgressTutorialGame == 'true') return;

        localStorage.setItem('completedLocationsTutorial', 'false');
        start();
        return;
      }

      const completedProgressTutorial = localStorage.getItem('completedProgressTutorial');
      if (completedProgressTutorial == 'true') return;

      start();
    }, 1000);
    return;
  }

  switch (userStore.user.value?.phase) {
    case StudyPhase.Baseline:
      await router.push('/locations');
      break;
    case StudyPhase.Game:
      await router.push('/dashboard');
      break;
    default:
      await router.push('/');
  }
});
</script>

<style>
:root {
  --v-onboarding-overlay-z: 9000 !important;
  --v-onboarding-step-z: 9001 !important;
}

#app {
  height: 600px !important;
  width: 350px !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}
</style>
