<template>
  <div class="flex flex-col rounded-md shadow-md bg-indigo-50 p-2 text-sm border border-indigo-300">
    <h1 class="text-sm font-medium">
      Das Abschließen dieser Aufgabe wird Sie <span class="font-semibold text-indigo-600">{{ amount }}</span>
      {{ resourceString }} kosten.
    </h1>
    <h2>
      Sie besitzen aktuell <span class="font-semibold text-indigo-600">{{ amountOwned }}</span> {{ resourceString }}
    </h2>
  </div>
</template>

<script lang="ts" setup>
import { ResourceTypes } from '@/models/enums';
import { computed } from 'vue';

const props = defineProps<{
  resourceType: ResourceTypes;
  amount: number;
  amountOwned: number;
}>();

const resourceString = computed(() => {
  switch (props.resourceType) {
    case ResourceTypes.PixelDust:
      return 'Pixelstaub';
    case ResourceTypes.Stamina:
      return 'Ausdauer';
    case ResourceTypes.Mana:
      return 'Mana';
  }

  return '';
});
</script>
