<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col lg:flex-row gap-2">
      <div class="grow flex gap-2">
        <AniimoFiltersModal />
        <label class="input w-full">
          <IconSearch class="size-5 text-base-content/50 shrink-0" />
          <input
            type="text"
            class="grow"
            placeholder="Chercher un aniimo..."
            v-model="searchQuery"
          />
          <button
            class="btn btn-ghost btn-square btn-sm -mr-2"
            v-if="searchQuery"
            @click="
              () => {
                searchQuery = '';
              }
            "
          >
            <IconX class="size-4" />
          </button>
        </label>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-row flex-wrap gap-2">
        <AniimoPathfinderCardModal />
        <AniimoExportModal />
        <AniimoSettingsModal />
      </div>
    </div>
    <div class="flex flex-col sm:flex-row items-center gap-2">
      <div
        class="text-base-content/75 text-sm flex items-center gap-1 font-semibold"
        title="Aniimo affichés/total"
      >
        <IconEye class="size-5" />
        Affichés : {{ aniimoFiltered.length }}/{{ aniimoTotal }}
      </div>
      <div
        class="text-base-content/75 text-sm flex items-center gap-1 font-semibold"
        title="Aniimo capturés"
        v-if="aniimoCaughtTotal > 0"
      >
        <IconSquareArrowDown class="size-5" />
        Capturés : {{ aniimoCaughtTotal }}
      </div>
      <AniimoHomelandModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import AniimoExportModal from '@/components/toolbar/AniimoExportModal.vue';
import AniimoFiltersModal from '@/components/toolbar/AniimoFiltersModal.vue';
import AniimoHomelandModal from '@/components/toolbar/AniimoHomelandModal.vue';
import AniimoPathfinderCardModal from '@/components/toolbar/AniimoPathfinderCardModal.vue';
import AniimoSettingsModal from '@/components/toolbar/AniimoSettingsModal.vue';
import { useAniilogStore } from '@/stores/aniilog';
import { IconEye, IconSearch, IconSquareArrowDown, IconX } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { aniimoFiltered, aniimoTotal, aniimoCaughtTotal, searchQuery } = storeToRefs(aniilogStore);
</script>
