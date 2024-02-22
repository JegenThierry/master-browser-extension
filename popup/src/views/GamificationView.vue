<template>
  <div class="p-2">
    <div class="stats shadow">
      <div class="stat p-4 py-2">
        <div class="stat-figure text-primary">
          <VueMaterialIcon class="w-5 h-5" :icon="mdiHeart" />
        </div>
        <div class="stat-title text-sm">Beiträge Gesamt</div>
        <div class="stat-value text-primary text-xl">25.6K</div>
        <div class="stat-desc"></div>
      </div>
      <div class="stat p-4 py-2">
        <div class="stat-title text-sm">Beiträge</div>
        <div class="stat-value text-xl">42</div>
        <div class="stat-figure text-secondary">
          <VueProfile :size="Size.XS" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import VueMaterialIcon from '@/components/VueMaterialIcon.vue';
import VueProfile from '@/components/VueProfile.vue';
import { Size, StudyPhase } from '@/models/enums';
import { useUserStore } from '@/stores/userStore';
import { mdiHeart } from '@mdi/js';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  if (userStore.user.value?.phase != StudyPhase.Game) router.push('/');
});
</script>
