<template>
  <div class="flex flex-col p-4 bg-indigo-700 drop-shadow-xl">
    <h1 class="text-lg font-semibold text-white">
      <slot></slot>
    </h1>
    <p class="text-xs text-gray-200"><slot name="description"></slot></p>
  </div>
</template>

<script setup lang="ts"></script>
