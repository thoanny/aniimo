<script setup lang="ts">
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const toastStore = useToastStore();
const { initToast } = toastStore;
const { toasts } = storeToRefs(toastStore);

onMounted(() => {
  initToast();
});
</script>

<template>
  <div class="toast mb-12 z-99">
    <div
      class="alert alert-soft shadow-lg"
      :class="`alert-${toast.type}`"
      v-for="toast in toasts"
      :key="toast.key"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>
