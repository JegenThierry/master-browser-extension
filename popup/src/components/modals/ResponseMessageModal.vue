<template>
  <!-- Audio Effect from: https://pixabay.com/sound-effects/search/success/ -->
  <audio ref="audioPlayer" :src="AudioFile"></audio>

  <dialog ref="messageModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="flex font-bold text-lg">
        <span>Belohnungen</span>
        <span class="ml-auto text-xs font-normal">
          {{ currentIndex + 1 }} / {{ responseMessages.length }}
        </span>
      </h3>

      <ExpDetailsModal
        v-if="activeResponseType == ResponseMessageType.Exp"
        :exp-needed="userStore.userResources.value?.expUntilNextLevel ?? 0"
        :gained-exp="activeResponseMessage?.amountGained ?? 0"
        :current-exp="userStore.userResources.value?.currentXp ?? 0"
      />

      <ImageDetailsModal
        v-else-if="
          activeResponseType == ResponseMessageType.Achievement ||
          activeResponseType == ResponseMessageType.Unlockable
        "
        :is-unlockable="activeResponseType == ResponseMessageType.Unlockable"
        :difficulty="activeResponseMessage?.achievementDifficulty"
        :unlockable-reward="activeResponseMessage?.unlockablesReward"
        :name="activeResponseMessage?.name ?? ''"
      />

      <ResourceDetailsModal
        v-else-if="
          activeResponseType == ResponseMessageType.Mana ||
          activeResponseType == ResponseMessageType.Stamina ||
          activeResponseType == ResponseMessageType.PixelDust
        "
        :amount="activeResponseMessage?.amountGained ?? 0"
        :resource-type="activeResponseMessage?.resourceTypes"
      />

      <MissionDetailsModal
        v-else-if="activeResponseType == ResponseMessageType.DailyMission"
        :name="activeResponseMessage?.name ?? ''"
        :message="activeResponseMessage?.message ?? ''"
      />

      <p class="py-4 text-base">{{ activeResponseMessage?.message }}</p>
      <button @click="nextMessage()" class="btn btn-primary ml-auto">Weiter</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ResponseMessageType } from '@/models/enums';
import ResponseMessage from '@/models/responseMessage';
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted, ref } from 'vue';
import ExpDetailsModal from './details/ExpDetailsModal.vue';
import ImageDetailsModal from './details/ImageDetailsModal.vue';
import ResourceDetailsModal from './details/ResourceDetailsModal.vue';
import MissionDetailsModal from './details/MissionDetailsModal.vue';
import AudioFile from '@/assets/music/success-1-6297.mp3';

const props = defineProps<{ responseMessages: ResponseMessage[] }>();
const emits = defineEmits(['close-modal']);

const userStore = useUserStore();
const messageModal = ref<HTMLDialogElement>();

const activeResponseMessage = ref<ResponseMessage | undefined>();
const currentIndex = ref(0);
const audioPlayer = ref();

const activeResponseType = computed(() => activeResponseMessage.value?.responseMessageType);

function nextMessage() {
  // No more messages left
  console.log(`Length: ${props.responseMessages.length}`);
  if (currentIndex.value >= props.responseMessages.length - 1) {
    currentIndex.value = 0;

    emits('close-modal');
    messageModal.value?.close();
    activeResponseMessage.value = undefined;
    return;
  }

  currentIndex.value = currentIndex.value + 1;
  activeResponseMessage.value = props.responseMessages[currentIndex.value];
}

onMounted(() => {
  console.log(props.responseMessages);

  if (props.responseMessages.length <= 0) {
    currentIndex.value = 0;
    emits('close-modal');
    return;
  }

  currentIndex.value = 0;
  activeResponseMessage.value = props.responseMessages[currentIndex.value];
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
