<template>
  <main class="relative w-full h-full p-8">
    <h1 class="text-2xl font-bold">Aktualisieren</h1>
    <form class="flex flex-col mt-8 gap-y-4 w-full my-auto">
      <label class="label-text"> Profilbild auswählen. </label>
      <ul class="grid grid-cols-3">
        <li>
          <img
            :class="selectedProfilePicture == ProfileImage.Ant ? ' border-2 border-indigo-700' : ''"
            @click="setProfilePicture(ProfileImage.Ant)"
            class="m-auto p-1 cursor-pointer w-16 h-16 rounded-full shadow-sm"
            src="/src/assets/profilePictures/Ant.webp"
            alt="Ant"
          />
        </li>
        <li>
          <img
            :class="selectedProfilePicture == ProfileImage.Cat ? ' border-2 border-indigo-700' : ''"
            @click="setProfilePicture(ProfileImage.Cat)"
            class="m-auto p-1 cursor-pointer w-16 h-16 rounded-full shadow-sm"
            src="/src/assets/profilePictures/Cat.webp"
            alt="Cat"
          />
        </li>
        <li>
          <img
            :class="selectedProfilePicture == ProfileImage.Dog ? ' border-2 border-indigo-700' : ''"
            @click="setProfilePicture(ProfileImage.Dog)"
            class="m-auto p-1 cursor-pointer w-16 h-16 rounded-full shadow-sm"
            src="/src/assets/profilePictures/Dog.webp"
            alt="Dog"
          />
        </li>
        <li>
          <img
            :class="selectedProfilePicture == ProfileImage.Elephant ? ' border-2 border-indigo-700' : ''"
            @click="setProfilePicture(ProfileImage.Elephant)"
            class="m-auto p-1 cursor-pointer w-16 h-16 rounded-full shadow-sm"
            src="/src/assets/profilePictures/Elephant.webp"
            alt="Elephant"
          />
        </li>
        <li>
          <img
            :class="selectedProfilePicture == ProfileImage.Owl ? ' border-2 border-indigo-700' : ''"
            @click="setProfilePicture(ProfileImage.Owl)"
            class="m-auto p-1 cursor-pointer w-16 h-16 rounded-full shadow-sm"
            src="/src/assets/profilePictures/Owl.webp"
            alt="Owl"
          />
        </li>
        <li>
          <img
            :class="selectedProfilePicture == ProfileImage.Sloth ? ' border-2 border-indigo-700' : ''"
            @click="setProfilePicture(ProfileImage.Sloth)"
            class="m-auto p-1 cursor-pointer w-16 h-16 rounded-full shadow-sm"
            src="/src/assets/profilePictures/Sloth.webp"
            alt="Sloth"
          />
        </li>
      </ul>
      <VueInputField
        id="username"
        v-model="username"
        :color="Color.Primary"
        label="Benutzername (Bitte geben Sie keine persönlichen Daten an.)"
        placeholder="Benutzername"
      />
      <button
        class="btn btn-primary"
        :class="username.length < 3 || selectedProfilePicture == undefined ? 'btn-disabled' : ''"
        type="button"
        @click="updateUserData"
      >
        Benutzerdaten aktualisieren
      </button>
    </form>

    <div class="absolute w-full h-full -z-10 -top-1/4 left-1/2 opacity-75 -rotate-45">
      <VueSquigglyShape />
    </div>

    <div class="absolute w-full h-full -z-10 -bottom-3/5 -left-1/4 opacity-75">
      <VueSquigglyShape />
    </div>
  </main>
</template>

<script lang="ts" setup>
import VueInputField from '@/components/inputs/VueInputField.vue';
import VueSquigglyShape from '@/components/shapes/VueSquigglyShape.vue';

import { ref } from 'vue';
import { Color, MessageType, ProfileImage } from '@/models/enums';
import userService from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { useNotificationStore } from '@/stores/notificationStore';
import messageService from '@/services/messageService';
import Browser from 'webextension-polyfill';
import { GAME_URL } from '@/models/constants';

const userStore = useUserStore();
const notificationStore = useNotificationStore();

const username = ref<string>('');

const selectedProfilePicture = ref<ProfileImage>(ProfileImage.None);

function setProfilePicture(profilePicture: ProfileImage) {
  selectedProfilePicture.value = profilePicture;
}

function updateUserData() {
  const uid = userStore.user.value?.uid;

  if (!uid) {
    notificationStore.addNotification('uid ist nicht gesetzt', MessageType.Error);
    return;
  }

  userService
    .updateUsername(uid, selectedProfilePicture.value, username.value)
    .then((res) => {
      messageService.setUser(res);
      Browser.tabs.create({ url: GAME_URL });
    })
    .catch((err) => notificationStore.addNotification(err, MessageType.Error));
}
</script>
