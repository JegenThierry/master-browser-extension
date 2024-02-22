import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import userAchievementsService from '@/services/userAchievementsService';
import userUnlockablesService from '@/services/userUnlockablesService';
import { useUserStore } from '@/stores/userStore';
import UserAchievements from '@/models/gamification/userAchievements';
import { useNotificationStore } from './notificationStore';
import { MessageType } from '@/models/enums';
import UserUnlockables from '@/models/gamification/userUnlockable';

const useStore = defineStore('gamification', () => {
  const userStore = useUserStore();
  const notificationStore = useNotificationStore();

  const achievements = ref<UserAchievements[]>([]);
  const unlockables = ref<UserUnlockables[]>([]);

  function updateUserAchievements() {
    userAchievementsService
      .fetchUserAchievements(userStore.user.value?.uid ?? '')
      .then((res: UserAchievements[]) => (achievements.value = res))
      .catch(() =>
        notificationStore.addNotification('Failed to fetch user achievements', MessageType.Error)
      );
  }

  function updateUserUnlockables() {
    userUnlockablesService
      .fetchUserUnlockables(userStore.user.value?.uid ?? '')
      .then((res: UserUnlockables[]) => (unlockables.value = res))
      .catch(() =>
        notificationStore.addNotification('Failed to fetch user unlockables', MessageType.Error)
      );
  }

  return { achievements, unlockables, updateUserAchievements, updateUserUnlockables };
});

export function useGamificationStore() {
  const store = useStore();
  const { achievements, unlockables } = storeToRefs(store);

  return {
    ...store,
    achievements,
    unlockables,
  };
}
