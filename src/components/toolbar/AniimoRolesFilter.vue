<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      class="btn btn-sm"
      :class="{
        'btn-soft': roleSelected?.id,
        'btn-neutral': !roleSelected?.id,
      }"
      @click.prevent="
        () => {
          setFilter('role', undefined);
        }
      "
    >
      Tous
    </button>

    <button
      v-for="role in rolesFiltered"
      :key="role.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': roleSelected?.id !== role.id,
        'btn-neutral': roleSelected?.id === role.id,
      }"
      @click.prevent="
        () => {
          setFilter('role', role.id);
        }
      "
    >
      <span v-if="role.fields.Icon" v-html="role.fields.Icon" class="size-5"></span>
      {{ role.fields.Title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { rolesFiltered, roleSelected } = storeToRefs(aniilogStore);
</script>
