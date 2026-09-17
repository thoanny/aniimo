<template>
  <div>
    <div
      class="group w-full h-full aspect-[210/390] rounded-box border-2 border-base-100 relative shadow-lg hover:shadow-xl overflow-hidden transition-all outline-offset-2"
      :class="{
        'border-green-300': aniimo.caught,
      }"
    >
      <div
        class="transition-all ease-in-out flex absolute top-0 left-0 bg-base-100/80 w-full h-full z-40 flex-col items-center justify-center gap-2 p-4 translate-y-full group-hover:translate-none opacity-0 group-hover:opacity-100"
      >
        <button class="btn btn-neutral" @click="toggleCaught(aniimo.id)">
          <IconSquareRoundedCheck class="size-6" v-if="aniimo.caught" />
          <IconSquareRounded class="size-6" v-else />
          Capturé
        </button>
        <button class="btn btn-neutral" @click="toggleHomeland(aniimo.id)">
          <IconSquareRoundedCheck class="size-6" v-if="aniimo.homeland" />
          <IconSquareRounded class="size-6" v-else />
          Homeland
        </button>
      </div>
      <AniimoBackgroundImage
        class="w-[135%] sm:w-[130%] -mx-[15%] absolute z-10"
        v-if="!aniimo.caught"
      />
      <AniimoBackgroundImage
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
        <template v-if="aniimo.fields.Number > 0"
          >N°{{ aniimo.fields.Number.toString().padStart(3, '0') }}</template
        >
        <template v-else>
          <IconAlertTriangleFilled class="size-5 text-error" />
        </template>
      </div>

      <IconHomeFilled class="absolute top-1 right-1 z-30 size-5" v-if="aniimo.homeland" />

      <img
        :src="getAniimoImageUrl(aniimo.fields.Image[0]?.path)"
        class="w-full h-full object-cover object-bottom pb-12 z-20 absolute"
        loading="lazy"
        v-if="aniimo.fields.Image"
      />
      <img
        src="/img/aniimo/default.png"
        class="w-full h-full object-cover object-bottom pb-12 z-20 absolute opacity-25"
        loading="lazy"
        v-else
      />
      <div class="flex flex-col gap-1 bottom-14 left-2 absolute w-8 z-20">
        <AniimoHomelandAbilityBadge
          v-for="ability in aniimo.fields.HomelandAbilities"
          :key="ability.id"
          :ability-id="ability.id"
        />
      </div>
      <div class="flex flex-col gap-1 bottom-14 right-2 absolute w-8 z-20">
        <!--  -->
        <AniimoElementIcon
          v-for="element in aniimo.fields.Elements"
          :key="element.id"
          :element-id="element.id"
        />
        <AniimoRoleIcon v-for="role in aniimo.fields.Roles" :key="role.id" :role-id="role.id" />
      </div>
      <div
        class="bg-base-100 text-base-content flex w-full px-4 py-2 text-base font-bold bottom-0 absolute left-0 justify-center flex flex-col items-center leading-4 z-20"
        :class="{
          'bg-green-300 text-green-900': aniimo.caught,
        }"
      >
        <span class="inline-flex items-center">
          {{ aniimo.fields.Title }}
        </span>
        <span class="font-normal text-xs line-clamp-1">{{ aniimo.fields.Form.fields.Title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AniimoBackgroundImage from '@/components/aniimo/AniimoBackgroundImage.vue';
import AniimoElementIcon from '@/components/aniimo/AniimoElementIcon.vue';
import AniimoHomelandAbilityBadge from '@/components/aniimo/AniimoHomelandAbilityBadge.vue';
import AniimoRoleIcon from '@/components/aniimo/AniimoRoleIcon.vue';
import { useAniilogStore } from '@/stores/aniilog';
import { getAniimoImageUrl } from '@/utils/image';
import {
  IconAlertTriangleFilled,
  IconHomeFilled,
  IconSquareRounded,
  IconSquareRoundedCheck,
} from '@tabler/icons-vue';

defineProps(['aniimo']);

const aniilogStore = useAniilogStore();
const { toggleCaught, toggleHomeland } = aniilogStore;
</script>
