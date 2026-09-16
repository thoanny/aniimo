<template>
  <div>
    <button
      class="btn btn w-full lg:w-37"
      :popovertarget="`popover-${key}`"
      :style="`anchor-name: --anchor-${key}`"
    >
      <span class="grow flex items-center gap-2">
        <div
          v-if="elementSelected?.fields.Icon"
          v-html="elementSelected.fields.Icon"
          class="size-5 shrink-0"
          :class="`text-element-${elementSelected?.id}`"
        ></div>
        {{ elementSelected ? elementSelected.fields.Title : '-- Éléments --' }}
      </span>
      <IconChevronUp class="size-5 shrink-0" v-if="isOpen" />
      <IconChevronDown class="size-5 shrink-0" v-else />
    </button>
    <ul
      class="dropdown menu bg-base-100 rounded-box z-40 shadow-sm mt-1 w-37"
      popover
      :id="`popover-${key}`"
      :style="`position-anchor: --anchor-${key}`"
      ref="popover"
    >
      <li>
        <a
          href="#!"
          @click.prevent="
            () => {
              setFilter('element', undefined);
              popover.hidePopover();
            }
          "
          :class="{
            'menu-active': undefined === elementSelected?.id,
          }"
        >
          -- Éléments --
        </a>
      </li>
      <li v-for="element in elementsFiltered" :key="element.id">
        <a
          href="#!"
          @click.prevent="
            () => {
              setFilter('element', element.id);
              popover.hidePopover();
            }
          "
          :class="{
            'menu-active': element.id === elementSelected?.id,
          }"
        >
          <div
            v-if="element.fields.Icon"
            v-html="element.fields.Icon"
            class="size-5"
            :class="element.id === elementSelected?.id ? '' : `text-element-${element.id}`"
          ></div>
          {{ element.fields.Title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const aniilogStore = useAniilogStore();
const { setFilter } = aniilogStore;
const { elementsFiltered, elementSelected } = storeToRefs(aniilogStore);
const key = (Math.random() + 1).toString(36).substring(5);
const popover = ref();
const isOpen = ref(false);

onMounted(() => {
  popover.value.addEventListener('toggle', (event: ToggleEvent) => {
    isOpen.value = event.newState === 'open';
  });
});
</script>
