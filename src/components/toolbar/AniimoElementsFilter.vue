<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      class="btn btn-sm"
      :class="{
        'btn-soft': elementSelected?.id,
        'btn-neutral': !elementSelected?.id,
      }"
      @click.prevent="
        () => {
          setFilter('element', undefined);
        }
      "
    >
      Tous
    </button>

    <button
      v-for="element in elementsFiltered"
      :key="element.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': elementSelected?.id !== element.id,
        'btn-neutral': elementSelected?.id === element.id,
      }"
      @click.prevent="
        () => {
          setFilter('element', element.id);
        }
      "
    >
      <span
        v-if="element.fields.Icon"
        v-html="element.fields.Icon"
        class="size-5"
        :class="element.id === elementSelected?.id ? '' : `text-element-${element.id}`"
      ></span>
      {{ element.fields.Title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { elementsFiltered, elementSelected } = storeToRefs(aniilogStore);
</script>
