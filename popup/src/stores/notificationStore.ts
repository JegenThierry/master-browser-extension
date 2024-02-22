import {defineStore, storeToRefs} from "pinia";
import {ref} from "vue";
import Notification from "@/models/notification";
import {MessageType} from "@/models/enums";
import {DEFAULT_NOTIFICATION_TIMEOUT} from "@/models/constants";

const useStore = defineStore("notification", () => {
    const notifications = ref<Notification[]>([]);
    let id = 0;

    function addNotification(message: string, messageType?: MessageType) {
        const notification = new Notification(id, message, messageType ?? MessageType.Info);
        notifications.value.push(notification);

        id++;
        setTimeout(() => removeNotification(notification.id), DEFAULT_NOTIFICATION_TIMEOUT);
    }

    function removeNotification(notificationId: number): void {
        notifications.value = notifications.value
            .filter((notification: Notification): boolean => notification.id != notificationId);
    }

    return {notifications, addNotification}
});

export function useNotificationStore() {
    const store = useStore();
    const {notifications} = storeToRefs(store);
    return {...store, notifications}
}
