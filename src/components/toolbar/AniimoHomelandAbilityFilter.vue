<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      class="btn btn-sm"
      :class="{
        'btn-soft': homelandAbilitySelected?.id,
        'btn-neutral': !homelandAbilitySelected?.id,
      }"
      @click.prevent="
        () => {
          setFilter('homelandAbility', undefined);
        }
      "
    >
      Toutes
    </button>

    <button
      v-for="ability in homelandAbilitiesFiltered"
      :key="ability.id"
      class="btn btn-sm"
      :class="{
        'btn-soft': homelandAbilitySelected?.id !== ability.id,
        'btn-neutral': homelandAbilitySelected?.id === ability.id,
      }"
      @click.prevent="
        () => {
          setFilter('homelandAbility', ability.id);
        }
      "
    >
      <span
        v-if="ability.fields.Icon"
        v-html="ability.fields.Icon"
        class="size-5"
        :class="ability.id === homelandAbilitySelected?.id ? '' : `text-ability-${ability.id}`"
      ></span>
      {{ ability.fields.Title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { storeToRefs } from 'pinia';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { homelandAbilitiesFiltered, homelandAbilitySelected } = storeToRefs(aniilogStore);
</script>
