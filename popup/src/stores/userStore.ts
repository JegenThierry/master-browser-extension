import type User from '@/models/user';
import UserResources from '@/models/userResources';
import messageService from '@/services/messageService';
import userService from '@/services/userService';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useNotificationStore } from './notificationStore';
import { MessageType } from '@/models/enums';

const useStore = defineStore('user', () => {
  const user = ref<User | undefined>(undefined);
  const userResources = ref<UserResources | undefined>(undefined);
  const notificationStore = useNotificationStore();

  async function loadData(): Promise<boolean> {
    try {
      user.value = await messageService.getUser();
      if (user.value == undefined || user.value.uid == '') return false;

      loadUserResources();
      return user.value.uid != undefined;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function loadUserData(): void {
    userService.fetchUser(user.value?.uid ?? '').then((res) => (user.value = res));
  }

  function loadUserResources(): void {
    userService
      .fetchUserResources(user.value!.uid)
      .then((res) => (userResources.value = res))
      .catch(() => notificationStore.addNotification('Resourcen konnten nicht geladen werden.', MessageType.Error));
  }

  return { user, userResources, loadData, loadUserResources, loadUserData };
});

export function useUserStore() {
  const store = useStore();
  const { user, userResources } = storeToRefs(store);
  return { ...store, user, userResources };
}
