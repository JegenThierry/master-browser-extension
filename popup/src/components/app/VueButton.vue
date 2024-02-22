<template>
  <button @click="emits('button-clicked')" :class="`${buttonTypeClass} ${sizeClass} btn flex`">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ButtonType, Size } from '@/models/enums';
import { computed } from 'vue';

const props = defineProps<{ buttonType: ButtonType; size: Size }>();
const emits = defineEmits(['button-clicked']);

const buttonTypeClass = computed(() => {
  switch (props.buttonType) {
    case ButtonType.Disabled:
      return 'btn-disabled';
    case ButtonType.Ghost:
      return 'btn-ghost';
    case ButtonType.Link:
      return 'btn-link';
    case ButtonType.Primary:
      return 'bg-indigo-700 hover:bg-indigo-500 text-white';
    case ButtonType.Secondary:
      return 'btn-secondary';
    default:
      return 'btn-primary';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case Size.XL:
    case Size.LG:
      return 'btn-lg';
    case Size.MD:
      return 'btn-md';
    case Size.SM:
      return 'btn-sm';
    case Size.XS:
    default:
      return 'btn-xs';
  }
});
</script>
