<template>
  <main class="relative flex flex-col w-full h-screen overflow-hidden min-h-screen p-8">
    <!-- <VueHeader v-if="!hasCompletedQuestionnaire">
      <template #default>Neuer Fragebogen</template>
      <template #description
        >Bitte beantworten sie den Fragebogen bis zu dem: {{ deadlineDate }}</template
      >
    </VueHeader>

    <VueHeader v-if="hasCompletedQuestionnaire">
      <template #default>Kein Fragebogen vorhanden</template>
      <template #description>Die Studie wird am {{ continuationDate }} fortgesetzt.</template>
    </VueHeader> -->

    <div class="flex flex-col gap-y-2 w-full my-auto bg-white bg-opacity-90 p-4 rounded-md shadow-md">
      <h1 class="text-2xl font-bold">
        {{ hasCompletedQuestionnaire ? 'Kein Fragebogen vorhanden' : 'Neuer Fragebogen' }}
      </h1>
      <p class="text-sm">
        {{
          hasCompletedQuestionnaire
            ? `Sie haben den Fragebogen ausgefüllt, die Studie wird am ${continuationDate} fortgesetzt.`
            : `Bitte beantworten Sie den Fragebogen bis zu dem: ${deadlineDate}.`
        }}
      </p>
      <div class="flex flex-col mt-8 gap-y-4 w-full my-auto">
        <!-- <button @click="activeStep = activeStep +1" class="btn btn-ghost">Zurück</button> -->
        <button
          v-if="!hasCompletedQuestionnaire"
          @click="navigateToSurveyPage()"
          class="w-full my-auto btn btn-primary"
        >
          Fragebogen ausfüllen.
        </button>
      </div>
    </div>

    <div class="fixed w-full h-full -z-10 -top-1/4 left-1/2 opacity-75 -rotate-45">
      <VueSquigglyShape />
    </div>

    <div class="fixed w-full h-full top-3/4 -left-1/4 -z-10 opacity-75">
      <VueSquigglyShape />
    </div>
  </main>
</template>

<script setup lang="ts">
import VueSquigglyShape from '@/components/shapes/VueSquigglyShape.vue';
import { GAME_URL } from '@/models/constants';
import { MessageType } from '@/models/enums';
import questionnaireService from '@/services/questionnaireService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted, ref } from 'vue';

const hasCompletedQuestionnaire = ref(false);
const linkExtension = ref<string>('');

const userStore = useUserStore();
const notificationStore = useNotificationStore();

const continuationDate = computed(() => {
  const today = new Date();
  const daysUntilThursday = (4 - today.getDay() + 7) % 7; // Calculate days until next Thursday
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + daysUntilThursday);

  // Format the date as DD.MM.YYYY
  const day = nextThursday.getDate().toString().padStart(2, '0');
  const month = (nextThursday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = nextThursday.getFullYear();

  return `${day}.${month}.${year}`;
});

const deadlineDate = computed(() => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilNextWednesday = (3 - dayOfWeek + 7) % 7; // 3 corresponds to Wednesday

  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilNextWednesday);

  const dd = String(nextWednesday.getDate()).padStart(2, '0');
  const mm = String(nextWednesday.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = nextWednesday.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
});

function navigateToSurveyPage() {
  window.open(`${GAME_URL}/questionnaire/${linkExtension.value}/${userStore.user.value?.uid}`);
}

onMounted(() => {
  questionnaireService
    .getActiveQuestionnaireGroupUrl(userStore.user.value?.uid ?? '')
    .then((res) => {
      linkExtension.value = res;
      if (res == undefined || res == '') hasCompletedQuestionnaire.value = true;
    })
    .catch(() =>
      notificationStore.addNotification('Fragebogen informationen konnten nicht geladen werden.', MessageType.Error)
    );
});
</script>
