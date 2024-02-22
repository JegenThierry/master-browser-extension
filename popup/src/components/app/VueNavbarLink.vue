<template>
  <button
    @click="router.push(href)"
    :class="isActive ? 'active' : 'border-t  border-neutral-200'"
    class="text-indigo-700 bg-neutral-100"
  >
    <VueMaterialIcon :icon="icon" class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import VueMaterialIcon from '../VueMaterialIcon.vue';

const props = defineProps<{ icon: string; href: string }>();
const router = useRouter();

const isActive = computed(() => props.href === router.currentRoute.value.path);
</script>
