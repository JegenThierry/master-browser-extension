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
            v-show="achievement.achievement.difficulty == AchievementDifficulty.Easy"
            src="/src/assets/game/Bronze.webp"
            loading="lazy"
            :class="achievement.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rounded-full object-contain w-10 h-10 p-0.5"
          />
          <img
            v-show="achievement.achievement.difficulty == AchievementDifficulty.Medium"
            src="/src/assets/game/Silver.webp"
            loading="lazy"
            :class="achievement.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rounded-full object-contain w-10 h-10 p-0.5"
          />
          <img
            v-show="achievement.achievement.difficulty == AchievementDifficulty.Hard"
            src="/src/assets/game/Gold.webp"
            loading="lazy"
            :class="achievement.isUnlocked ? 'saturate-100' : 'saturate-0'"
            class="rounded-full object-contain w-10 h-10 p-0.5"
          />
        </div>
      </div>
      <div class="flex flex-col justify-center h-full w-full ml-2">
        <span class="text-sm font-medium">{{ achievement.achievement.name }}</span>
        <span class="text-xs">{{ description }}</span>
      </div>
      <div class="flex items-center justify-center h-full w-16 bg-indigo-500 rounded-r-md">
        <span class="text-sm font-medium text-white">{{ `+${expReward}` }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AchievementDifficulty } from '@/models/enums';
import UserAchievements from '@/models/gamification/userAchievements';
import { computed } from 'vue';

const props = defineProps<{ achievement: UserAchievements }>();

const description = computed(() => {
  const desc = props.achievement.achievement.description;
  if (desc == undefined || desc == '')
    return 'Es liegt keine Beschreibung für das Achievement vor.';

  return desc;
});

const expReward = computed(() => {
  switch (props.achievement.achievement.difficulty) {
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
  if (props.achievement.achievement.neededValue == 0) return 0;
  return Math.floor(
    (props.achievement.currentValue / props.achievement.achievement.neededValue) * 100
  );
});
</script>
