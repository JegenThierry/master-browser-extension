<template>
  <div class="flex flex-col">
    <h1 class="mx-auto font-bold text-indigo-700 text-2xl">+{{ amount }}</h1>
    <div class="relative w-full">
      <img
        v-if="resourceType == ResourceTypes.Mana || resourceType == ResourceTypes.ManaPotion"
        class="w-32 mx-auto object-cover"
        src="/src/assets/resources/ManaPotion.webp"
        alt="'Mana'"
      />
      <img
        v-else-if="resourceType == ResourceTypes.PixelDust"
        class="w-32 mx-auto object-cover"
        src="/src/assets/resources/PixelDust.webp"
        alt="'PixelDust'"
      />
      <img
        v-else-if="
          resourceType == ResourceTypes.Stamina || resourceType == ResourceTypes.StaminaPotion
        "
        class="w-32 mx-auto object-cover"
        src="/src/assets/resources/StaminaPotion.webp"
        alt="'Stamina'"
      />
      <div v-else>Eine unbekannte Resource wurde erworben.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResourceTypes } from '@/models/enums';

defineProps<{ amount: number; resourceType?: ResourceTypes }>();
</script>
