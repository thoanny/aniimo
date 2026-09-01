<template>
  <div>
    <button
      class="btn btn-sm w-full md:w-32"
      :popovertarget="`popover-${key}`"
      :style="`anchor-name: --anchor-${key}`"
    >
      <span class="grow flex items-center gap-2">
        <div
          v-if="roleSelected?.fields.Icon"
          v-html="roleSelected.fields.Icon"
          class="size-5 shrink-0"
        ></div>
        {{ roleSelected ? roleSelected.fields.Title : 'Tous les rôles' }}
      </span>
      <IconChevronUp class="size-5 shrink-0" v-if="isOpen" />
      <IconChevronDown class="size-5 shrink-0" v-else />
    </button>
    <ul
      class="dropdown menu menu-sm bg-base-100 rounded-box z-40 shadow-sm mt-1 w-32"
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
              setFilter('role', undefined);
              popover.hidePopover();
            }
          "
        >
          Tous les rôles
        </a>
      </li>
      <li v-for="role in rolesFiltered" :key="role.id">
        <a
          href="#!"
          @click.prevent="
            () => {
              setFilter('role', role.id);
              popover.hidePopover();
            }
          "
        >
          <div v-if="role.fields.Icon" v-html="role.fields.Icon" class="size-5"></div>
          {{ role.fields.Title }}
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
const { rolesFiltered, roleSelected } = storeToRefs(aniilogStore);
const key = (Math.random() + 1).toString(36).substring(5);
const popover = ref();
const isOpen = ref(false);

onMounted(() => {
  popover.value.addEventListener('toggle', (event: ToggleEvent) => {
    isOpen.value = event.newState === 'open';
  });
});
</script>
