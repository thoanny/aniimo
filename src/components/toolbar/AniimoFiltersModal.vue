<script setup lang="ts">
import AniimoElementsFilter from '@/components/toolbar/AniimoElementsFilter.vue';
import AniimoFormsFilter from '@/components/toolbar/AniimoFormsFilter.vue';
import AniimoHomelandAbilityFilter from '@/components/toolbar/AniimoHomelandAbilityFilter.vue';
import AniimoRolesFilter from '@/components/toolbar/AniimoRolesFilter.vue';
import { useAniilogStore } from '@/stores/aniilog';
import { IconFilter, IconFilterX } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const modal = ref();
const aniilogStore = useAniilogStore();
const { resetFilters } = aniilogStore;
const { activefiltersCount } = storeToRefs(aniilogStore);
</script>

<template>
  <div class="indicator">
    <span
      class="indicator-item badge badge-primary font-bold badge-xs px-1 mr-2 text-base-100"
      v-if="activefiltersCount > 0"
    >
      {{ activefiltersCount }}
    </span>
    <button class="btn btn-neutral btn-circle" @click="modal.showModal()">
      <IconFilter class="size-5" />
    </button>
  </div>
  <dialog ref="modal" class="modal modal-start">
    <div class="modal-box max-w-md rounded-none">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none flex gap-2 items-center">
        <IconFilter />
        Filtrer les Aniimo
      </h3>

      <h4 class="mt-4 mb-2 font-bold">Formes</h4>
      <AniimoFormsFilter />

      <h4 class="mt-4 mb-2 font-bold">Éléments</h4>
      <AniimoElementsFilter />

      <h4 class="mt-4 mb-2 font-bold">Rôles</h4>
      <AniimoRolesFilter />

      <h4 class="mt-4 mb-2 font-bold">Capacités de foyer</h4>
      <AniimoHomelandAbilityFilter />

      <button class="btn btn-error btn-soft btn-block mt-6" @click="resetFilters">
        <IconFilterX class="size-5" />
        Réinitialiser les filtres
      </button>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
