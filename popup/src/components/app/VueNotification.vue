<template>
  <div :class="`flex z-50 h-12 ${altertClass}`">
    <VueMaterialIcon class="h-5 w-5" :icon="iconFromMessageType" />
    <span class="text-sm">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { MessageType } from '@/models/enums';
import { computed } from 'vue';
import { mdiAlert, mdiAlertCircleOutline, mdiInformation, mdiCheckCircleOutline } from '@mdi/js';
import VueMaterialIcon from '@/components/VueMaterialIcon.vue';

const props = defineProps<{ messageType: MessageType; message: string }>();

const altertClass = computed(() => {
  switch (props.messageType) {
    case MessageType.Alert:
      return 'alert';
    case MessageType.Success:
      return 'alert alert-success';
    case MessageType.Warning:
      return 'alert alert-warning';
    case MessageType.Error:
      return 'alert alert-error';
    case MessageType.Info:
    default:
      return 'alert alert-info';
  }
});

const iconFromMessageType = computed(() => {
  switch (props.messageType) {
    case MessageType.Alert:
      return mdiAlert;
    case MessageType.Success:
      return mdiCheckCircleOutline;
    case MessageType.Warning:
      return mdiAlert;
    case MessageType.Error:
      return mdiAlertCircleOutline;
    case MessageType.Info:
    default:
      return mdiInformation;
  }
});
</script>
