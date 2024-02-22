import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import type ResponseMessage from '@/models/responseMessage';
import type UserNotification from '@/models/userNotification';
import NotificationService from '@/services/notificationService';
import { useNotificationStore } from './notificationStore';

const useStore = defineStore('message', () => {
  const notificationStore = useNotificationStore();

  const messages = ref<ResponseMessage[]>([]);
  const notifications = ref<UserNotification[]>([]);

  function updateUserNotifications(userId: string) {
    NotificationService.GetUserNotifications(userId)
      .then((res) => (notifications.value = res))
      .catch(() =>
        notificationStore.addNotification('Benachrichtigungen konnten nicht geladen werden')
      );
  }

  return { messages, notifications, updateUserNotifications };
});

export function useMessageStore() {
  const store = useStore();
  const { messages, notifications } = storeToRefs(store);
  return { ...store, messages, notifications };
}
