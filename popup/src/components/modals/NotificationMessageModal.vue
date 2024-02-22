<template>
  <!-- Audio Effect from: https://pixabay.com/sound-effects/search/success/ -->
  <audio ref="audioPlayer" :src="AudioFile"></audio>

  <dialog ref="messageModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="flex font-bold text-lg">
        <span>Zustimmungen</span>
        <span class="ml-auto text-xs font-normal">
          {{ currentIndex + 1 }} / {{ notifications.length }}
        </span>
      </h3>

      <div class="flex flex-col">
        <h1 class="mx-auto font-bold text-indigo-700 text-2xl">
          {{ activeNotification?.amount }}
        </h1>
      </div>

      <p class="py-4 text-base">{{ activeNotification?.message }}</p>
      <button @click="nextMessage()" class="btn btn-primary ml-auto">Weiter</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import AudioFile from '@/assets/music/success-1-6297.mp3';
import type UserNotification from '@/models/userNotification';
import notificationService from '@/services/notificationService';

const props = defineProps<{ notifications: UserNotification[] }>();
const emits = defineEmits(['close-modal']);

const userStore = useUserStore();
const messageModal = ref<HTMLDialogElement>();

const activeNotification = ref<UserNotification | undefined>();
const currentIndex = ref(0);
const audioPlayer = ref();

function nextMessage() {
  // Only mark notification as
  if (userStore.user.value && activeNotification.value) {
    notificationService.UpdateNotificationAsSeen(
      userStore.user.value?.uid ?? '',
      activeNotification.value?.id ?? -1
    );
  }

  // No more messages left
  if (currentIndex.value >= props.notifications.length - 1) {
    currentIndex.value = 0;

    emits('close-modal');
    messageModal.value?.close();
    activeNotification.value = undefined;
    return;
  }

  currentIndex.value = currentIndex.value + 1;
  activeNotification.value = props.notifications[currentIndex.value];
}

onMounted(() => {
  if (props.notifications.length <= 0) {
    currentIndex.value = 0;
    emits('close-modal');
    return;
  }

  currentIndex.value = 0;
  activeNotification.value = props.notifications[currentIndex.value];
  messageModal.value?.showModal();

  audioPlayer.value.volume = 0.5;
  audioPlayer.value.play();
});
</script>

<style>
.animate-scale-in {
  animation: scaleIn 2s ease 0s 1 normal forwards;
}

@keyframes scaleIn {
  0% {
    transform: scaleX(0);
    transform-origin: 0% 0%;
  }

  100% {
    transform: scaleX(1);
    transform-origin: 0% 0%;
  }
}
</style>
