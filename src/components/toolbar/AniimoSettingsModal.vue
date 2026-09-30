<template>
  <button class="btn btn-neutral btn-block lg:btn-square" @click="openModal">
    <IconSettings stroke="1.75" class="size-5" />
    <span class="lg:hidden">Paramètres</span>
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-sm">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none flex gap-2 items-center">
        <IconSettings />
        Paramètres
      </h3>
      <div class="flex flex-col gap-2 mt-4">
        <label class="label text-sm text-base-content">
          <input type="checkbox" class="toggle toggle-success" v-model="settings.umbral" />
          Afficher la capture des formes ombrales
        </label>
        <label class="label text-sm text-base-content">
          <input type="checkbox" class="toggle toggle-success" v-model="settings.sparkling" />
          Afficher la capture des formes étincellantes
        </label>
        <label class="label text-sm text-base-content">
          <input
            type="checkbox"
            class="toggle toggle-success"
            v-model="settings.homelandAbilities"
          />
          Afficher les capacités de foyer
        </label>
        <label class="label text-sm text-base-content">
          <input type="checkbox" class="toggle toggle-success" v-model="settings.elements" />
          Afficher les éléments
        </label>
        <label class="label text-sm text-base-content">
          <input type="checkbox" class="toggle toggle-success" v-model="settings.roles" />
          Afficher les rôles
        </label>
        <label class="label text-sm text-base-content">
          <input type="checkbox" class="toggle toggle-success" v-model="settings.stages" />
          Afficher les phases
        </label>
        <label class="label text-sm text-base-content">
          <input type="checkbox" class="toggle toggle-success" v-model="settings.homeland" />
          Activer la gestion du foyer
        </label>

        <button class="btn btn-error btn-outline mt-2" @click="handleReset">
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
import { IconSettings } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const modal = ref();
const aniilogStore = useAniilogStore();
const { resetStoreState } = aniilogStore;
const { settings } = storeToRefs(aniilogStore);

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

<style scoped>
label {
  user-select: none;
}
</style>
