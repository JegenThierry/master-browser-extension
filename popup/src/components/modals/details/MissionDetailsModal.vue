<template>
  <div class="flex flex-col">
    <h1 class="mx-auto py-4 font-bold text-indigo-700 text-2xl">{{ name }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string; message: string }>();
</script>
