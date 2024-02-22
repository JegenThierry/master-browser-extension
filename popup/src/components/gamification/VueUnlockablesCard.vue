<template>
  <div class="rounded-md h-16 w-full bg-gradient-to-tl from-indigo-50 to-white shadow-md">
    <div class="flex items-center h-full">
      <div class="flex items-center justify-center w-16 rounded-l-md">
        <div
          class="radial-progress text-primary w-12 h-12"
          :style="{
            '--value': `${progress}`,
            '--thickness': '0.25rem',
            '--size': '3rem',
          }"
          role="progressbar"
        >
          <img
            v-show="unlockable.unlockable.reward == UnlockablesReward.MarkerCommon"
            src="/src/assets/game/MarkerCommon.webp"
            loading="lazy"
            :class="unlockable.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rotate-12 rounded-full object-contain w-10 h-10 p-0.5"
          />
          <img
            v-show="unlockable.unlockable.reward == UnlockablesReward.MarkerGreenPink"
            src="/src/assets/game/MarkerGreenRed.webp"
            loading="lazy"
            :class="unlockable.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rotate-12 rounded-full object-contain w-10 h-10 p-0.5"
          />
          <img
            v-show="unlockable.unlockable.reward == UnlockablesReward.MarkerRainbow"
            src="/src/assets/game/MarkerRainbow.webp"
            loading="lazy"
            :class="unlockable.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rotate-12 rounded-full object-contain w-10 h-10 p-0.5"
          />
          <img
            v-show="unlockable.unlockable.reward == UnlockablesReward.MarkerRare"
            src="/src/assets/game/MarkerRare.webp"
            loading="lazy"
            :class="unlockable.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rotate-12 rounded-full object-contain w-10 h-10 p-0.5"
          />
          <img
            v-show="unlockable.unlockable.reward == UnlockablesReward.MarkerSuperRare"
            src="/src/assets/game/MarkerSuperRare.webp"
            loading="lazy"
            :class="unlockable.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rotate-12 rounded-full object-contain w-10 h-10 p-0.5"
          />
        </div>
      </div>
      <div class="flex flex-col justify-center h-full w-full ml-2">
        <span class="text-sm font-medium">{{ unlockable.name }}</span>
        <span class="text-xs">{{ description }}</span>
      </div>
      <div class="flex items-center justify-center h-full w-16 bg-indigo-500 rounded-r-md">
        <span class="text-sm font-medium text-white">{{ `+${expReward}` }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AchievementDifficulty, UnlockablesReward } from '@/models/enums';
import UserUnlockables from '@/models/gamification/userUnlockable';
import { computed } from 'vue';

const props = defineProps<{ unlockable: UserUnlockables }>();

const description = computed(() => {
  const desc = props.unlockable.unlockable.description;
  if (desc == undefined || desc == '')
    return 'Es liegt keine Beschreibung für das Achievement vor.';

  return desc;
});

const expReward = computed(() => {
  switch (props.unlockable.unlockable.difficulty) {
    case AchievementDifficulty.Easy:
      return 5;
    case AchievementDifficulty.Medium:
      return 10;
    case AchievementDifficulty.Hard:
      return 20;
    default:
      return 0;
  }
});

const progress = computed(() => {
  if (props.unlockable.unlockable.neededValue == 0) return 0;
  return Math.floor(
    (props.unlockable.currentValue / props.unlockable.unlockable.neededValue) * 100
  );
});
</script>
