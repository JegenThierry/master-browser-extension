<template>
  <svg :title="title" viewBox="0 0 24 24" fill="currentColor">
    <path :d="icon" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title?: string }>();
</script>
