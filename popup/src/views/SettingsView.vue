<script setup lang="ts">
import VueHeader from '@/components/fonting/VueHeader.vue';
import { MessageType } from '@/models/enums';
import userService from '@/services/userService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/userStore';
import { computed, ref } from 'vue';

const userStore = useUserStore();
const notificationStore = useNotificationStore();

const deleteModal = ref<HTMLDialogElement>();

const uid = computed(() => userStore.user.value?.uid);

function deleteUserData() {
  userService
    .deleteUser(uid.value ?? '')
    .then(() => {
      notificationStore.addNotification('Alle Nutzerdaten wurden entfernt.', MessageType.Success);
    })
    .catch(() => {
      notificationStore.addNotification(
        'Nutzerdaten konnten nicht entfernt werden, bitte wenden Sie sich an den Studienkoordinator mit der obigen UID.',
        MessageType.Error
      );
    });
}

function closeModal() {
  deleteModal.value?.close();
}

function openDeleteDialog() {
  deleteModal.value?.showModal();
}
</script>

<template>
  <VueHeader>
    <template #default>Einstellungen</template>
    <template #description>Hier können Sie ihre UID einsehen und die Nutzerdaten löschen</template>
  </VueHeader>

  <div class="flex flex-col p-4 rounded-md gap-y-4 divide-gray-100 divide-y">
    <div class="flex flex-col gap-y-2">
      <label class="text-sm font-medium">UID</label>
      <div class="font-semibold">{{ uid }}</div>
    </div>
    <div class="flex flex-col gap-y-2 pt-4">
      <RouterLink to="/impressum" class="btn btn-ghost">Impressum</RouterLink>
    </div>
    <div class="flex flex-col gap-y-2 pt-4">
      <RouterLink to="/tutorial" class="btn btn-ghost">Tutorial</RouterLink>
    </div>
    <div class="flex flex-col gap-y-2 pt-4">
      <label class="text-sm font-medium">Ich möchte meine Daten löschen.</label>
      <button @click="openDeleteDialog()" class="btn btn-error">Endgültig löschen</button>
    </div>
  </div>

  <dialog ref="deleteModal" class="modal">
    <div class="modal-box flex flex-col">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <h3 class="font-bold text-lg">Daten endgültig löschen</h3>
      <p class="py-4">
        Dieser vorgang kann nicht rückgängig gemacht werden. Eine erneute Teilnahme an der Studie ist ausgeschlossen.
      </p>
      <div class="flex gap-x-2 ml-auto">
        <button class="btn btn-ghost btn-sm" @click="closeModal()">Abbrechen</button>
        <button class="btn btn-error btn-sm" @click="deleteUserData()">Löschen</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
