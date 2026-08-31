<template>
  <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-2">
    <div class="flex flex-col md:flex-row gap-2">
      <AniimoFormsFilterComponent v-model="formFilter" />
      <AniimoElementsFilterComponent v-model="elementFilter" />
      <AniimoRolesFilterComponent v-model="roleFilter" />
      <button
        class="btn md:btn-square justify-start md:justify-center"
        v-if="formFilter || elementFilter || roleFilter"
        @click.prevent="
          () => {
            formFilter = undefined;
            elementFilter = undefined;
            roleFilter = undefined;
          }
        "
      >
        <IconX class="size-4" />
        <span class="md:hidden">Réinitialiser les filtre</span>
      </button>
    </div>

    <div>
      <label class="flex gap-2 items-center">
        <input type="checkbox" class="toggle toggle-sm" v-model="caughtFilter" />
        <span class="text-sm">Masquer capturés</span>
      </label>
    </div>
  </div>

  <div class="py-6">
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6"
    >
      <div class="" v-for="aniimo in filteredAniimo" :key="aniimo.id">
        <div
          class="w-full h-full aspect-[210/390] rounded-box border-2 border-base-100 relative shadow-lg hover:shadow-xl overflow-hidden transition-all cursor-pointer"
          :class="{
            'border-green-300': aniimo.caught,
          }"
          @click="toggle(aniimo.id)"
        >
          <AniimoBackgroundComponent
            class="w-[135%] sm:w-[130%] -mx-[15%] absolute z-10"
            v-if="!aniimo.caught"
          />
          <AniimoBackgroundComponent
            class="w-[135%] sm:w-[130%] -mx-[15%] absolute z-10"
            gradient-start="#f0fdf4"
            color="#dcfce7"
            gradient-end="#b9f8cf"
            v-else
          />
          <div
            class="rounded-br-lg bg-base-100 text-base-content inline-flex px-3 py-1 text-base font-bold absolute top-0 left-0 text-sm z-30"
            :class="{
              'bg-green-300 text-green-900': aniimo.caught,
            }"
          >
            N°{{ aniimo.fields.Number.toString().padStart(3, '0') }}
          </div>

          <img
            :src="getImageUrl(aniimo.fields.Image[0]?.path)"
            class="w-full h-full object-cover object-bottom pb-12 z-20 absolute"
            v-if="aniimo.fields.Image"
          />
          <img
            src="/img/aniimo/default.png"
            class="w-full h-full object-cover object-bottom pb-12 z-20 absolute opacity-25"
            v-else
          />
          <div
            class="bg-base-100 text-base-content flex w-full px-4 py-2 text-base font-bold bottom-0 absolute left-0 justify-center flex flex-col items-center leading-4 z-20"
            :class="{
              'bg-green-300 text-green-900': aniimo.caught,
            }"
          >
            <span class="inline-flex items-center"
              >{{ aniimo.fields.Title }}
              <IconGenderMale class="size-4" v-if="aniimo.fields.Gender === 'Male'" />
              <IconGenderFemale class="size-4" v-else-if="aniimo.fields.Gender === 'Female'"
            /></span>

            <span class="font-normal text-xs">{{ aniimo.fields.Form.fields.Title }} Form</span>
          </div>
          <div class="flex flex-col gap-1 bottom-14 right-2 absolute w-8 z-20">
            <AniimoElementComponent
              v-for="element in aniimo.fields.Elements"
              :key="element.id"
              :element-id="element.id"
            />
            <AniimoRoleComponent
              v-for="role in aniimo.fields.Roles"
              :key="role.id"
              :role-id="role.id"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AniimoBackgroundComponent from '@/components/AniimoBackgroundComponent.vue';
import AniimoElementComponent from '@/components/AniimoElementComponent.vue';
import AniimoElementsFilterComponent from '@/components/AniimoElementsFilterComponent.vue';
import AniimoFormsFilterComponent from '@/components/AniimoFormsFilterComponent.vue';
import AniimoRoleComponent from '@/components/AniimoRoleComponent.vue';
import AniimoRolesFilterComponent from '@/components/AniimoRolesFilterComponent.vue';
import aniimoData from '@/data/aniimo.json';
import { useAniilogStore } from '@/stores/aniilog';
import { IconGenderFemale, IconGenderMale, IconX } from '@tabler/icons-vue';
import { computed, ref } from 'vue';

const aniilogStore = useAniilogStore();
const { toggle } = aniilogStore;
const formFilter = ref<number>();
const roleFilter = ref<number>();
const elementFilter = ref<number>();
const caughtFilter = ref<boolean>();

const getImageUrl = (path: string | undefined): string => {
  if (!path || typeof path === 'undefined') {
    return '/img/aniimo/default.png';
  }
  return '/img/aniimo/' + path.split('/').pop();
};

const filteredAniimo = computed(() => {
  return aniimoData
    .map((aniimo) => ({
      ...aniimo,
      caught: aniilogStore.aniimo.indexOf(aniimo.id) >= 0,
    }))
    .filter((aniimo) => {
      if (!formFilter.value) {
        return true;
      }
      return aniimo.fields.Form.id === formFilter.value;
    })
    .filter((aniimo) => {
      if (!elementFilter.value) {
        return true;
      }
      return aniimo.fields.Elements.map((element) => element.id).indexOf(elementFilter.value) >= 0;
    })
    .filter((aniimo) => {
      if (!roleFilter.value) {
        return true;
      }
      return aniimo.fields.Roles.map((role) => role.id).indexOf(roleFilter.value) >= 0;
    })
    .filter((aniimo) => {
      if (!caughtFilter.value) {
        return true;
      }
      return aniimo.caught !== true;
    });
});
</script>

<style scoped>
details div :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
