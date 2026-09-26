<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      class="btn btn-sm"
      :class="{
        'btn-soft': formSelected?.id,
        'btn-neutral': !formSelected?.id,
      }"
      @click.prevent="
        () => {
          setFilter('form', undefined);
        }
      "
    >
      Toutes
    </button>

    <button
      v-for="form in formsFiltered"
      :key="form.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': formSelected?.id !== form.id,
        'btn-neutral': formSelected?.id === form.id,
      }"
      @click.prevent="
        () => {
          setFilter('form', form.id);
        }
      "
    >
      {{ form.fields.Title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { formsFiltered, formSelected } = storeToRefs(aniilogStore);
</script>
