<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col lg:flex-row gap-2">
      <div class="grow">
        <label class="input w-full">
          <IconSearch class="size-5 text-base-content/50 shrink-0" />
          <input
            type="text"
            class="grow"
            placeholder="Chercher un aniimo..."
            v-model="searchQuery"
          />
          <button
            class="btn btn-ghost btn-square btn-sm -mr-2"
            v-if="searchQuery"
            @click="
              () => {
                searchQuery = '';
              }
            "
          >
            <IconX class="size-4" />
          </button>
        </label>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row flex-wrap gap-2">
        <AniimoFormsFilter
          class="sm:block"
          :class="{
            hidden: hideFilters,
          }"
        />
        <AniimoElementsFilter
          class="sm:block"
          :class="{
            hidden: hideFilters,
          }"
        />
        <AniimoRolesFilter
          class="sm:block"
          :class="{
            hidden: hideFilters,
          }"
        />
        <AniimoHomelandAbilityFilter
          class="sm:block"
          :class="{
            hidden: hideFilters,
          }"
        />
        <button
          class="btn btn-neutral lg:btn-square sm:flex"
          :class="{
            hidden: hideFilters,
          }"
          :disabled="!filters.form && !filters.element && !filters.role && !filters.homelandAbility"
          @click="resetFilters"
        >
          <IconX class="size-4" />
          <span class="lg:hidden">Réinitialiser les filtre</span>
        </button>
        <button
          class="btn btn-ghost btn-sm flex sm:hidden"
          style="--btn-bg: transparent"
          @click="
            () => {
              hideFilters = !hideFilters;
            }
          "
        >
          <IconChevronDown class="size-5" v-if="hideFilters" />
          <IconChevronUp class="size-5" v-else />
          {{ hideFilters ? 'Afficher' : 'Masquer' }} les filtres
          <IconChevronDown class="size-5" v-if="hideFilters" />
          <IconChevronUp class="size-5" v-else />
        </button>
        <AniimoSettingsModal />
      </div>
    </div>
    <div class="flex gap-2">
      <div
        class="text-base-content/75 text-sm flex items-center gap-1 font-semibold"
        title="Aniimo affichés/total"
      >
        <IconEye class="size-5" />
        Affichés : {{ aniimoFiltered.length }}/{{ aniimoTotal }}
      </div>
      <div
        class="text-base-content/75 text-sm flex items-center gap-1 font-semibold"
        title="Aniimo capturés"
        v-if="aniimoCaughtTotal > 0"
      >
        <IconSquareArrowDown class="size-5" />
        Capturés : {{ aniimoCaughtTotal }}
      </div>
      <AniimoHomelandModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import AniimoElementsFilter from '@/components/toolbar/AniimoElementsFilter.vue';
import AniimoFormsFilter from '@/components/toolbar/AniimoFormsFilter.vue';
import AniimoHomelandAbilityFilter from '@/components/toolbar/AniimoHomelandAbilityFilter.vue';
import AniimoHomelandModal from '@/components/toolbar/AniimoHomelandModal.vue';
import AniimoRolesFilter from '@/components/toolbar/AniimoRolesFilter.vue';
import AniimoSettingsModal from '@/components/toolbar/AniimoSettingsModal.vue';
import { useAniilogStore } from '@/stores/aniilog';
import {
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconSearch,
  IconSquareArrowDown,
  IconX,
} from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const aniilogStore = useAniilogStore();
const { resetFilters } = aniilogStore;
const { filters, aniimoFiltered, aniimoTotal, aniimoCaughtTotal, searchQuery } =
  storeToRefs(aniilogStore);

const hideFilters = ref<boolean>(true);
</script>
