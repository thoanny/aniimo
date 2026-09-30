<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      class="btn btn-sm"
      :class="{
        'btn-soft': stageSelected?.id,
        'btn-neutral': !stageSelected?.id,
      }"
      @click.prevent="
        () => {
          setFilter('stage', undefined);
        }
      "
    >
      Toutes
    </button>

    <button
      v-for="stage in stagesFiltered"
      :key="stage.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': stageSelected?.id !== stage.id,
        'btn-neutral': stageSelected?.id === stage.id,
      }"
      @click.prevent="
        () => {
          setFilter('stage', stage.id);
        }
      "
    >
      <span v-if="stage.fields.Icon" v-html="stage.fields.Icon" class="size-5"></span>
      {{ stage.fields.Title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { stagesFiltered, stageSelected } = storeToRefs(aniilogStore);
</script>
