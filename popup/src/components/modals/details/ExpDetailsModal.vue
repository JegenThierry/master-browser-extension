<template>
  <div class="flex flex-col">
    <h1 class="mx-auto font-bold text-indigo-700 text-2xl">+{{ gainedExp }} xp</h1>
    <div class="relative w-full">
      <progress
        class="progress progress-warning w-full z-10 mt-4 animate-scale-in bg-gray-200"
        :value="currentExp + gainedExp"
        :max="expNeeded"
      />
      <div class="absolute w-full top-2.5 z-0">
        <progress class="progress w-full bg-gray-200" :value="0" :max="expNeeded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ expNeeded: number; currentExp: number; gainedExp: number }>();
</script>
