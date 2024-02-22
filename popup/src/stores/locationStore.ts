import type Location from '@/models/location';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './userStore';
import locationService from '@/services/locationService';
import { useNotificationStore } from './notificationStore';
import { MessageType } from '@/models/enums';

const useStore = defineStore('location', () => {
  const userStore = useUserStore();
  const notificationStore = useNotificationStore();

  const majorLocations = ref<Location[]>([]);
  const subLocations = ref<Location[]>([]);
  const selectedLocation = ref<Location | undefined>(undefined);

  function selectLocation(location: Location | undefined) {
    selectedLocation.value = location;
    if (location) {
      updateSublocations(location);
      return;
    }
    subLocations.value = [];
  }

  function updateLocations() {
    const userId = userStore.user.value?.uid ?? '';

    locationService
      .fetchLocations(userId)
      .then((res: Location[]) => {
        majorLocations.value = res;
        selectedLocation.value = undefined;
      })
      .catch(() =>
        notificationStore.addNotification(
          'Liste an internetseiten konnten nicht geladen werden',
          MessageType.Error
        )
      );
  }

  function updateSublocations(location: Location) {
    const userId = userStore.user.value?.uid ?? '';
    const locationId = location.id;

    locationService
      .fetchSubLocations(userId, locationId)
      .then((res: Location[]) => (subLocations.value = res))
      .catch(() =>
        notificationStore.addNotification(
          'Subseiten konnten nicht geladen werden',
          MessageType.Error
        )
      );
  }

  return { majorLocations, subLocations, selectedLocation, selectLocation, updateLocations, updateSublocations };
});

export function useLocationStore() {
  const store = useStore();

  const { majorLocations, selectedLocation, subLocations } = storeToRefs(store);
  return { ...store, majorLocations, selectedLocation, subLocations };
}
