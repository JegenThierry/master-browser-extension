<template>
  <div class="avatar">
    <div :class="`${computedSize} rounded-full shadow-lg`">
      <img
        alt="profile"
        loading="lazy"
        src="https://i.ibb.co/cT13jPP/d66f76f2-e95e-4bf9-ad1a-283b84dbed7a-upscayl-4x-realesrgan-x4plus.jpg"
        title="Profilbild"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Size } from '@/models/enums';
import { computed } from 'vue';

const props = defineProps<{ size: Size }>();

const computedSize = computed(() => {
  switch (props.size) {
    case Size.XL:
    case Size.LG:
      return 'w-32';
    case Size.MD:
      return 'w-24';
    case Size.SM:
    case Size.XS:
    default:
      return 'w-16';
  }
});
</script>
