<template>
  <div class="flex flex-col">
    <h1 class="mx-auto font-bold text-indigo-700 text-2xl">{{ name }}</h1>
    <div v-if="isUnlockable" class="w-full">
      <img
        v-if="unlockableReward == UnlockablesReward.MarkerCommon"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/MarkerCommon.webp"
        alt="Marker Common"
      />
      <img
        v-if="unlockableReward == UnlockablesReward.MarkerGreenPink"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/MarkerGreenRed.webp"
        alt="Marker Green Pink"
      />
      <img
        v-if="unlockableReward == UnlockablesReward.MarkerRainbow"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/MarkerRainbow.webp"
        alt="Marker Rainbow"
      />
      <img
        v-if="unlockableReward == UnlockablesReward.MarkerRare"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/MarkerRare.webp"
        alt="Marker Rare"
      />
      <img
        v-if="unlockableReward == UnlockablesReward.MarkerSuperRare"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/MarkerSuperRare.webp"
        alt="Marker Super Rare"
      />
    </div>
    <div v-else>
      <img
        v-if="difficulty == AchievementDifficulty.Easy"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/Bronze.webp"
        alt="Bronze"
      />

      <img
        v-if="difficulty == AchievementDifficulty.Medium"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/Silver.webp"
        alt="Silver"
      />

      <img
        v-if="difficulty == AchievementDifficulty.Hard"
        class="w-32 mx-auto object-cover"
        src="/src/assets/game/Gold.webp"
        alt="Gold"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AchievementDifficulty, UnlockablesReward } from '@/models/enums';

defineProps<{
  isUnlockable: boolean;
  unlockableReward?: UnlockablesReward;
  difficulty?: AchievementDifficulty;
  name: string;
}>();
</script>
