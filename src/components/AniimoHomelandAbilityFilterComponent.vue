<template>
  <div>
    <button
      class="btn btn-sm w-full md:w-38"
      :popovertarget="`popover-${key}`"
      :style="`anchor-name: --anchor-${key}`"
    >
      <span class="grow flex items-center gap-2">
        <div
          v-if="homelandAbilitySelected?.fields.Icon"
          v-html="homelandAbilitySelected.fields.Icon"
          class="size-5 shrink-0"
          :class="`text-ability-${homelandAbilitySelected?.id}`"
        ></div>
        {{ homelandAbilitySelected ? homelandAbilitySelected.fields.Title : 'Toutes les abilités' }}
      </span>
      <IconChevronUp class="size-5 shrink-0" v-if="isOpen" />
      <IconChevronDown class="size-5 shrink-0" v-else />
    </button>
    <ul
      class="dropdown menu menu-sm bg-base-100 rounded-box z-40 shadow-sm mt-1 w-38"
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
              setFilter('homelandAbility', undefined);
              popover.hidePopover();
            }
          "
        >
          Toutes les abilités
        </a>
      </li>
      <li v-for="ability in homelandAbilitiesFiltered" :key="ability.id">
        <a
          href="#!"
          @click.prevent="
            () => {
              setFilter('homelandAbility', ability.id);
              popover.hidePopover();
            }
          "
        >
          <div
            v-if="ability.fields.Icon"
            v-html="ability.fields.Icon"
            class="size-5"
            :class="`text-ability-${ability.id}`"
          ></div>
          {{ ability.fields.Title }}
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
const { homelandAbilitiesFiltered, homelandAbilitySelected } = storeToRefs(aniilogStore);
const key = (Math.random() + 1).toString(36).substring(5);
const popover = ref();
const isOpen = ref(false);

onMounted(() => {
  popover.value.addEventListener('toggle', (event: ToggleEvent) => {
    isOpen.value = event.newState === 'open';
  });
});
</script>
