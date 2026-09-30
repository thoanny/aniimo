<template>
  <div>
    <div
      class="select-none w-full h-full aspect-[210/390] rounded-box border-2 border-base-100 relative shadow-lg hover:shadow-xl overflow-hidden transition-all outline-offset-2"
      :class="{
        'border-green-300':
          aniimo.caught ||
          (aniimo.umbral && settings.umbral) ||
          (aniimo.sparkling && settings.sparkling),
      }"
    >
      <div class="absolute top-2 right-2 z-40 flex flex-col items-end gap-1.5">
        <div class="flex gap-1.5 items-center">
          <button
            class="btn btn-xs btn-circle"
            @click="toggleUmbral(aniimo.id)"
            :class="{
              'btn-neutral': !aniimo.umbral,
              'btn-success': aniimo.umbral,
            }"
            v-if="settings.umbral"
          >
            <AniimoUmbralIcon class="size-7" />
          </button>
          <button
            class="btn btn-xs btn-circle"
            @click="toggleSparkling(aniimo.id)"
            :class="{
              'btn-neutral': !aniimo.sparkling,
              'btn-success': aniimo.sparkling,
            }"
            v-if="settings.sparkling"
          >
            <AniimoSparklingIcon class="size-7" />
          </button>
          <button
            class="btn btn-xs btn-circle"
            @click="toggleCaught(aniimo.id)"
            :class="{
              'btn-neutral': !aniimo.caught,
              'btn-success': aniimo.caught,
            }"
          >
            <AniimoBaseIcon class="size-7" />
          </button>
        </div>
        <div class="flex gap-1.5 items-center" v-if="settings.homeland">
          <button
            class="btn btn-xs btn-neutral btn-circle"
            @click="removeFromHomeland(aniimo.id)"
            :disabled="aniimo.homelandCount <= 0"
          >
            <IconHomeMinus class="size-4" />
          </button>
          <button class="btn btn-xs btn-neutral btn-circle" @click="addToHomeland(aniimo.id)">
            <IconHomePlus class="size-4" />
          </button>
        </div>
      </div>
      <AniimoBackgroundImage
        class="w-[135%] sm:w-[130%] -mx-[15%] absolute z-10"
        v-if="
          !aniimo.caught &&
          (!aniimo.umbral || !settings.umbral) &&
          (!aniimo.sparkling || !settings.sparkling)
        "
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
          'bg-green-300 text-green-900':
            aniimo.caught ||
            (aniimo.umbral && settings.umbral) ||
            (aniimo.sparkling && settings.sparkling),
        }"
      >
        <template v-if="aniimo.fields.Number > 0"
          >N°{{ aniimo.fields.Number.toString().padStart(3, '0') }}</template
        >
        <template v-else>
          <IconAlertTriangleFilled class="size-5 text-error" />
        </template>
      </div>

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
        <template v-if="settings.homelandAbilities">
          <AniimoHomelandAbilityBadge
            v-for="ability in aniimo.fields.HomelandAbilities"
            :key="ability.id"
            :ability-id="ability.id"
          />
        </template>
      </div>
      <div class="flex flex-col gap-1 bottom-14 right-2 absolute w-8 z-20">
        <template v-if="settings.elements">
          <AniimoElementIcon
            v-for="element in aniimo.fields.Elements"
            :key="element.id"
            :element-id="element.id"
          />
        </template>
        <template v-if="settings.roles">
          <AniimoRoleIcon v-for="role in aniimo.fields.Roles" :key="role.id" :role-id="role.id" />
        </template>
        <AniimoStageIcon
          v-if="aniimo.fields.Stage && settings.stages"
          :stage-id="aniimo.fields.Stage.id"
        />
      </div>
      <div
        class="bg-base-100 text-base-content flex w-full px-4 py-2 text-base font-bold bottom-0 absolute left-0 justify-center flex flex-col items-center leading-4 z-20"
        :class="{
          'bg-green-300 text-green-900':
            aniimo.caught ||
            (aniimo.umbral && settings.umbral) ||
            (aniimo.sparkling && settings.sparkling),
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
import AniimoStageIcon from '@/components/aniimo/AniimoStageIcon.vue';
import AniimoBaseIcon from '@/components/icons/AniimoBaseIcon.vue';
import AniimoSparklingIcon from '@/components/icons/AniimoSparklingIcon.vue';
import AniimoUmbralIcon from '@/components/icons/AniimoUmbralIcon.vue';
import { useAniilogStore } from '@/stores/aniilog';
import { getAniimoImageUrl } from '@/utils/image';
import { IconAlertTriangleFilled, IconHomeMinus, IconHomePlus } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';

defineProps(['aniimo']);

const aniilogStore = useAniilogStore();
const { toggleCaught, toggleSparkling, toggleUmbral, addToHomeland, removeFromHomeland } =
  aniilogStore;
const { settings } = storeToRefs(aniilogStore);
</script>
