<template>
  <button
    class="btn btn-block btn-sm md:btn-square justify-start md:justify-center"
    @click="openModal"
  >
    <IconSettings stroke="1.75" class="size-5" />
    <span class="md:hidden">Paramètres</span>
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-sm">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none">Paramètres</h3>
      <div class="flex flex-col gap-4 mt-4">
        <label class="flex gap-2 items-center">
          <input type="checkbox" class="toggle toggle-sm toggle-success" v-model="filters.caught" />
          <span class="text-sm">Masquer les aniimo capturés</span>
        </label>
        <div class="divider divider-error mb-0">
          <IconAlertHexagonFilled class="size-6 shrink-0 text-error" />
        </div>
        <button class="btn btn-error btn-outline" @click="handleReset">
          Réinitialier toutes les données
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { IconAlertHexagonFilled, IconSettings } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const modal = ref();
const aniilogStore = useAniilogStore();
const { resetStoreState } = aniilogStore;
const { filters } = storeToRefs(aniilogStore);

const openModal = () => {
  modal.value.showModal();
};

const handleReset = () => {
  if (confirm('Êtes-vous sûr de supprimer vos données ?')) {
    resetStoreState();
    modal.value.close();
  }
};
</script>
