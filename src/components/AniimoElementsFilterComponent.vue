<template>
  <div>
    <button
      class="btn w-full md:w-44"
      :popovertarget="`popover-${key}`"
      :style="`anchor-name: --anchor-${key}`"
    >
      <span class="grow flex items-center gap-2">
        <div
          v-if="selected?.fields.Icon"
          v-html="selected.fields.Icon"
          class="size-5 shrink-0"
          :class="`text-element-${selected?.fields.Title.toLowerCase()}`"
        ></div>
        {{ selected ? selected.fields.Title : 'Tous les éléments' }}
      </span>
      <IconChevronUp class="size-5 shrink-0" v-if="isOpen" />
      <IconChevronDown class="size-5 shrink-0" v-else />
    </button>
    <ul
      class="dropdown menu bg-base-100 rounded-box z-40 shadow-sm mt-1 w-44"
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
              model = undefined;
              popover.hidePopover();
            }
          "
        >
          Tous les éléments
        </a>
      </li>
      <li v-for="element in elementsFiltered" :key="element.id">
        <a
          href="#!"
          @click.prevent="
            () => {
              model = element.id;
              popover.hidePopover();
            }
          "
        >
          <div
            v-if="element.fields.Icon"
            v-html="element.fields.Icon"
            class="size-5"
            :class="`text-element-${element.fields.Title.toLowerCase()}`"
          ></div>
          {{ element.fields.Title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import elements from '@/data/elements.json';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
import { computed, onMounted, ref } from 'vue';

const model = defineModel();

const key = (Math.random() + 1).toString(36).substring(5);
const popover = ref();
const isOpen = ref(false);

const selected = computed(() => {
  return elements.find((element) => element.id === model.value);
});

const elementsFiltered = computed(() => {
  return elements.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
});

onMounted(() => {
  popover.value.addEventListener('toggle', (event: ToggleEvent) => {
    isOpen.value = event.newState === 'open';
  });
});
</script>
