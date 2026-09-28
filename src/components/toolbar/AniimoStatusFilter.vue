<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      v-for="status in statusFiltered"
      :key="status.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': statusSelected !== status.value,
        'btn-neutral': statusSelected === status.value,
      }"
      @click.prevent="
        () => {
          setFilter('status', status.value);
        }
      "
    >
      {{ status.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { statusSelected } = storeToRefs(aniilogStore);

const statusFiltered = [
  {
    id: 'all',
    value: undefined,
    title: 'Tous',
  },
  {
    id: 'caught',
    value: 1,
    title: 'Capturés',
  },
  {
    id: 'notcaught',
    value: 0,
    title: 'Non capturés',
  },
];
</script>
