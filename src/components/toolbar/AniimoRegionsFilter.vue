<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      class="btn btn-sm"
      :class="{
        'btn-soft': regionSelected?.id,
        'btn-neutral': !regionSelected?.id,
      }"
      @click.prevent="
        () => {
          setFilter('region', undefined);
        }
      "
    >
      Toutes
    </button>

    <button
      v-for="region in regionsFiltered"
      :key="region.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': regionSelected?.id !== region.id,
        'btn-neutral': regionSelected?.id === region.id,
      }"
      @click.prevent="
        () => {
          setFilter('region', region.id);
        }
      "
    >
      {{ region.fields.Title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { regionsFiltered, regionSelected } = storeToRefs(aniilogStore);
</script>
