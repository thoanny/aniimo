<template>
  <AniilogToolbar />
  <div class="py-6">
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6"
      v-if="aniimoFiltered.length > 0"
    >
      <AniimoCard v-for="aniimo in aniimoFiltered" :key="aniimo.id" :aniimo="aniimo" />
    </div>
    <div class="flex justify-center" v-else>
      <div class="alert">Aucun Aniimo a afficher...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AniilogToolbar from '@/components/AniilogToolbar.vue';
import AniimoCard from '@/components/AniimoCard.vue';
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const aniilogStore = useAniilogStore();
const { importAniilogFromUrl } = aniilogStore;
const { aniimoFiltered } = storeToRefs(aniilogStore);

onMounted(() => {
  importAniilogFromUrl();
});
</script>
