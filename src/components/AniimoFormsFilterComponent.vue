<template>
  <div>
    <button
      class="btn w-full md:w-52"
      :popovertarget="`popover-${key}`"
      :style="`anchor-name: --anchor-${key}`"
    >
      <span class="grow flex items-center gap-2">
        {{ selected ? `${selected.fields.Title} Form` : 'Toutes les formes' }}
      </span>
      <IconChevronUp class="size-5 shrink-0" v-if="isOpen" />
      <IconChevronDown class="size-5 shrink-0" v-else />
    </button>
    <ul
      class="dropdown menu bg-base-100 rounded-box z-40 shadow-sm mt-1 w-52"
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
          Toutes les formes
        </a>
      </li>
      <li v-for="form in formsFiltered" :key="form.id">
        <a
          href="#!"
          @click.prevent="
            () => {
              model = form.id;
              popover.hidePopover();
            }
          "
        >
          {{ form.fields.Title }} Form
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import forms from '@/data/forms.json';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
import { computed, onMounted, ref } from 'vue';

const model = defineModel();

const key = (Math.random() + 1).toString(36).substring(5);
const popover = ref();
const isOpen = ref(false);

const selected = computed(() => {
  return forms.find((form) => form.id === model.value);
});

const formsFiltered = computed(() => {
  return forms.sort((a, b) => a.fields.Title.localeCompare(b.fields.Title));
});

onMounted(() => {
  popover.value.addEventListener('toggle', (event) => {
    isOpen.value = event.newState === 'open';
  });
});
</script>
