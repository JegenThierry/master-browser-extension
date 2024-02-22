<template>
  <!-- <main class="relative w-full h-full overflow-hidden p-8"></main>
  <main class="relative w-full h-full overflow-hidden p-8"></main>
  <main class="relative w-full h-full overflow-hidden p-8"></main> -->

  <main class="flex w-full h-screen min-h-screen overflow-hidden p-8">
    <div
      v-if="activeStep == 0"
      class="flex flex-col gap-y-2 w-full my-auto bg-white bg-opacity-90 p-4 rounded-md shadow-md"
    >
      <h1 v-if="!showAccountLoad" class="text-2xl font-bold">Vielen Dank!</h1>
      <p v-if="!showAccountLoad" class="text-sm">Wir bedanken uns herzlich für Ihr interesse an dieser Studie.</p>
      <div v-if="!showAccountLoad" class="flex flex-col mt-8 gap-y-4 w-full my-auto">
        <!-- <button @click="activeStep = activeStep +1" class="btn btn-ghost">Zurück</button> -->
        <button @click="activeStep = activeStep + 1" class="btn btn-primary">Weiter</button>
      </div>
      <a
        v-if="!showAccountLoad"
        @click="showAccountLoad = true"
        class="text-black text-center cursor-pointer text-xs hover:underline"
        >Ich habe bereits ein Account
      </a>

      <VueInputField
        v-if="showAccountLoad"
        id="user-id-to-load"
        v-model="userIdToLoad"
        :color="Color.Primary"
        label="Userid"
        placeholder="UID"
      />
      <div v-if="showAccountLoad" class="flex flex-col mt-8 gap-y-4 w-full my-auto">
        <button @click="loadUserAccount()" class="btn btn-primary">Benutzerkonto Laden</button>
      </div>
      <a
        v-if="showAccountLoad"
        @click="showAccountLoad = false"
        class="text-black text-center underline text-xs hover:underline"
        >Neuen Account anlegen
      </a>
    </div>

    <div
      v-if="activeStep == 1"
      class="flex flex-col gap-y-2 my-auto w-full bg-white bg-opacity-90 p-4 rounded-md shadow-md"
    >
      <h1 class="text-2xl font-bold">Studieninformationen</h1>
      <p class="text-sm">
        In dieser Studie, die von Jegen Thierry betreut wird, geht es darum, unterschiedliche Aufgaben auf Webseiten von
        Medienintermediären (Informationsverteiler) zu erledigen.
      </p>
      <div class="flex flex-col mt-8 gap-y-4 w-full my-auto">
        <!-- <button @click="activeStep = activeStep +1" class="btn btn-ghost">Zurück</button> -->
        <button @click="activeStep = activeStep + 1" class="btn btn-primary">Weiter</button>
      </div>
    </div>

    <div
      v-if="activeStep == 2"
      class="flex flex-col gap-y-2 my-auto w-full bg-white bg-opacity-90 p-4 rounded-md shadow-md"
    >
      <h1 class="text-2xl font-bold">Studie Beginnen</h1>
      <p class="text-sm">Bevor Sie mit der Studie fortfahren können, müssen Sie ein Benutzerkonto anlegen.</p>
      <form class="flex flex-col mt-8 gap-y-4 w-full my-auto">
        <button class="flex btn btn-primary" type="button" @click="createUser()">
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-1 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span> Benutzerkonto anlegen. </span>
        </button>
      </form>
    </div>

    <div class="fixed w-full h-full -z-10 -top-1/4 left-1/2 opacity-75 -rotate-45">
      <VueSquigglyShape />
    </div>

    <div class="fixed w-full h-full top-3/4 -left-1/4 -z-10 opacity-75">
      <VueSquigglyShape />
    </div>
  </main>
</template>

<script lang="ts" setup>
import VueSquigglyShape from '@/components/shapes/VueSquigglyShape.vue';
import { Color, MessageType } from '@/models/enums';
import messageService from '@/services/messageService';
import userService from '@/services/userService';
import { useNotificationStore } from '@/stores/notificationStore';

import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import type User from '@/models/user';
import { ref } from 'vue';
import VueInputField from '@/components/inputs/VueInputField.vue';

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const activeStep = ref<number>(0);
const showAccountLoad = ref<boolean>();
const userIdToLoad = ref<string>('');
const isLoading = ref<boolean>(false);

function loadUserAccount() {
  userService.fetchUser(userIdToLoad.value).then(async (res: User) => {
    try {
      userStore.user.value = res;
      messageService.setUser(res);
      router.push('/new-questionnaire');
      notificationStore.addNotification('Benutzerkonto geladen.', MessageType.Success);
    } catch (error) {
      router.push('/new-questionnaire');
    }
  });
}

async function createUser() {
  isLoading.value = true;
  const extensionId = await messageService.getExtensionId();

  userService
    .createUser(extensionId)
    .then((res: User) => {
      userStore.user.value = res;
      messageService.setUser(res);
      router.push('/new-questionnaire');
      notificationStore.addNotification('Benutzerkonto erstellt.', MessageType.Success);
    })
    .catch(() => notificationStore.addNotification('Benutzerkonto konnte nicht erreicht werden.', MessageType.Error))
    .finally(() => {
      isLoading.value = false;
    });
}
</script>
