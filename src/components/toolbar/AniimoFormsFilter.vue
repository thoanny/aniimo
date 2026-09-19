<template>
  <div>
    <button
      class="btn w-full lg:w-46"
      :popovertarget="`popover-${key}`"
      :style="`anchor-name: --anchor-${key}`"
    >
      <span class="grow flex items-center gap-2">
        {{ formSelected ? `${formSelected.fields.Title}` : '-- Formes --' }}
      </span>
      <IconChevronUp class="size-5 shrink-0" v-if="isOpen" />
      <IconChevronDown class="size-5 shrink-0" v-else />
    </button>
    <ul
      class="dropdown menu bg-base-100 rounded-box z-40 shadow-sm mt-1 w-46 max-h-[75dvh]"
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
              setFilter('form', undefined);
              popover.hidePopover();
            }
          "
          :class="{
            'menu-active': undefined === formSelected?.id,
          }"
        >
          -- Formes --
        </a>
      </li>
      <li v-for="form in formsFiltered" :key="form.id">
        <a
          href="#!"
          @click.prevent="
            () => {
              setFilter('form', form.id);
              popover.hidePopover();
            }
          "
          :class="{
            'menu-active': form.id === formSelected?.id,
          }"
        >
          {{ form.fields.Title }}
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
const { formsFiltered, formSelected } = storeToRefs(aniilogStore);
const key = (Math.random() + 1).toString(36).substring(5);
const popover = ref();
const isOpen = ref<boolean>(false);

onMounted(() => {
  popover.value.addEventListener('toggle', (event: ToggleEvent) => {
    isOpen.value = event.newState === 'open';
  });
});
</script>
