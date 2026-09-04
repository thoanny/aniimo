<template>
  <button class="btn btn-xs btn-neutral" @click="openModal">
    <IconHome class="size-4" />
    {{
      aniilogStore.homeland.length > 0 ? `Homeland : ${aniilogStore.homeland.length}` : 'Homeland'
    }}
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-md max-h-[90dvh]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none">Homeland</h3>
      <div class="flex flex-col gap-4 mt-4">
        <div class="grid grid-cols-7 gap-1">
          <span
            v-for="ability in aniilogStore.homelandAbilitiesTotals"
            :key="ability.id"
            class="badge pl-1 pr-2 w-full gap-1"
            :class="`bg-ability-${ability?.id}`"
            :style="{
              '--badge-color': `var(--color-ability-${ability?.id})`,
              '--badge-fg': 'var(--color-base-100)',
            }"
          >
            <div v-if="ability?.icon" v-html="ability.icon" class="size-5 shrink-0"></div>
            <div>{{ ability.total }}</div>
          </span>
        </div>
        <table class="table table-xs" v-if="aniilogStore.aniimoHomelandFiltered.length > 0">
          <thead>
            <tr>
              <th>Aniimo</th>
              <th>Abilités</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="aniimo in aniilogStore.aniimoHomelandFiltered"
              :key="aniimo.id"
              class="hover:bg-base-300"
            >
              <td>
                <div class="flex items-center gap-2">
                  <img
                    :src="getAniimoImageUrl(aniimo.fields.Image[0]?.path)"
                    alt=""
                    class="size-10 object-cover rounded bg-[#efe8d6] shrink-0"
                  />
                  <div>
                    <div class="text-sm font-bold">{{ aniimo.fields.Title }}</div>
                    <div class="text-xs">{{ aniimo.fields.Form.fields.Title }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex gap-1">
                  <AniimoHomelandAbilityBadge
                    v-for="ability in aniimo.fields.HomelandAbilities"
                    :key="ability.id"
                    :ability-id="ability.id"
                  />
                </div>
              </td>
              <td>
                <button
                  class="btn btn-square btn-sm btn-error btn-outline"
                  @click="toggleHomeland(aniimo.id)"
                >
                  <IconHomeMinus class="size-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert -mt-4" v-else>
          <span
            >Ajoutez des aniimo à votre homeland, en cliquant droit (appuie long sur mobile) sur un
            aniimo !</span
          >
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import AniimoHomelandAbilityBadge from '@/components/aniimo/AniimoHomelandAbilityBadge.vue';
import { useAniilogStore } from '@/stores/aniilog';
import { getAniimoImageUrl } from '@/utils/image.ts';
import { IconHome, IconHomeMinus } from '@tabler/icons-vue';
import { ref } from 'vue';

const modal = ref();
const aniilogStore = useAniilogStore();
const { toggleHomeland } = aniilogStore;

const openModal = () => {
  modal.value.showModal();
};
</script>
