<template>
  <a
    @click.prevent="emits('button-clicked')"
    :title="title"
    class="h-6 w-6 hover:brightness-150 transition-all duration-150"
    href="#"
  >
    <VueMaterialIcon class="w-6 h-6 text-indigo-700" :icon="icon" />
  </a>
</template>

<script setup lang="ts">
import VueMaterialIcon from '@/components/VueMaterialIcon.vue';

const props = defineProps<{ icon: string; title: string }>();
const emits = defineEmits(['button-clicked']);
</script>
