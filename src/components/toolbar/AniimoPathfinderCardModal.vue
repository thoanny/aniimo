<template>
  <button class="btn btn-neutral btn-block lg:btn-square" @click="openModal">
    <IconId stroke="1.75" class="size-5" />
    <span class="lg:hidden">Carte de nomade</span>
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-lg max-h-[95dvh]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none flex gap-2 items-center">
        <IconId />
        Carte de nomade
      </h3>
      <p class="mt-4">
        Créez votre carte de nomade et partagez-là avec vos ami·e·s et sur les réseaux
        sociaux&nbsp;!
      </p>
      <div class="my-4 select-none">
        <div
          class="rounded-box flex flex-col gap-2 justify-between items-center p-2 pb-3 svg-background max-w-[19.75rem] mx-auto"
          :style="{
            backgroundColor: pathfinderCard.background || 'var(--color-primary)',
            color: pathfinderCard.color || 'var(--color-primary-content)',
          }"
          ref="pathfinderCardEl"
        >
          <div class="h-full aspect-[300/492] relative overflow-hidden rounded-xl">
            <div class="absolute top-0 z-30 w-full flex justify-center items-start">
              <SmoothAngleIcon
                class="size-4 -scale-y-[1] shrink-0"
                :style="{
                  color: pathfinderCard.background || 'var(--color-primary)',
                }"
              />
              <div
                class="flex flex-col gap-2 justify-center items-center font-semibold pb-2 px-4 rounded-b-xl"
                :style="{
                  backgroundColor: pathfinderCard.background || 'var(--color-primary)',
                }"
              >
                <div class="text-2xl font-bold">
                  {{ pathfinderCard.username || 'USERNAME' }}
                </div>
                <div class="text-sm -mt-2" v-if="pathfinderCard.uid">
                  UID : {{ pathfinderCard.uid }}
                </div>
              </div>
              <SmoothAngleIcon
                class="size-4 -scale-x-[1] -scale-y-[1] shrink-0"
                :style="{
                  color: pathfinderCard.background || 'var(--color-primary)',
                }"
              />
            </div>

            <div class="absolute bottom-0 z-30 w-full flex justify-center items-end">
              <SmoothAngleIcon
                class="size-4"
                :style="{
                  color: pathfinderCard.background || 'var(--color-primary)',
                }"
              />
              <div
                class="flex gap-2 justify-center items-start font-semibold pt-2 pl-3 pr-4 rounded-t-xl"
                :style="{
                  backgroundColor: pathfinderCard.background || 'var(--color-primary)',
                }"
              >
                <div class="flex gap-1 items-center">
                  <AniimoCaughtIcon class="size-8" />
                  {{ statistics.caught }}
                </div>
                <div class="flex gap-1 items-center">
                  <AniimoPrismanaIcon class="size-8" />
                  {{ statistics.prismana }}
                </div>
                <div class="flex gap-1 items-center">
                  <AniimoUmbrabowIcon class="size-8" />
                  {{ statistics.umbrabow }}
                </div>
              </div>
              <SmoothAngleIcon
                class="size-4 -scale-x-[1]"
                :style="{
                  color: pathfinderCard.background || 'var(--color-primary)',
                }"
              />
            </div>

            <AniimoBackgroundImage class="w-[135%] sm:w-[130%] -mx-[15%] absolute z-10" />
            <img
              :src="aniimoImage || '/img/aniimo/default.png'"
              class="object-cover h-full z-20 relative"
            />
          </div>
          <div class="text-center flex flex-col gap-2">
            <div class="text-xs opacity-75">
              Créer ta propre carte de nomade sur <span class="underline">aniimo.thoanny.fr</span>
            </div>
          </div>
        </div>
      </div>

      <fieldset class="fieldset">
        <label class="label" for="aniimo">Aniimo préféré</label>
        <select class="select w-full" name="aniimo" v-model="pathfinderCard.aniimo">
          <option>Choisir</option>
          <option v-for="aniimo in filteredAniimo" :key="aniimo.id" :value="aniimo.id">
            {{ aniimo.name }} ({{ aniimo.form }})
          </option>
        </select>
      </fieldset>

      <div class="flex gap-4">
        <fieldset class="fieldset w-full">
          <label class="label" for="popover-background">Couleur de fond</label>
          <button
            class="btn border-base-content/20"
            popovertarget="popover-background"
            style="anchor-name: --anchor-background"
            :style="{
              '--btn-bg': pathfinderCard.background,
            }"
          ></button>
          <div
            class="dropdown dropdown-top rounded-box bg-base-100 shadow-md"
            popover
            id="popover-background"
            style="position-anchor: --anchor-background"
          >
            <Sketch
              v-model="pathfinderCard.background"
              @update:modelValue="onChangeBackground"
              :disableAlpha="true"
              :presetColors
            />
          </div>
        </fieldset>
        <fieldset class="fieldset w-full">
          <label class="label" for="popover-color">Couleur de texte</label>
          <button
            class="btn border-base-content/20"
            popovertarget="popover-color"
            style="anchor-name: --anchor-color"
            :style="{
              '--btn-bg': pathfinderCard.color,
            }"
          ></button>
          <div
            class="dropdown dropdown-top dropdown-end rounded-box bg-base-100 shadow-md"
            popover
            id="popover-color"
            style="position-anchor: --anchor-color"
          >
            <Sketch
              v-model="pathfinderCard.color"
              @update:modelValue="onChangeColor"
              :disableAlpha="true"
              :presetColors
            />
          </div>
        </fieldset>
      </div>

      <div class="flex gap-4">
        <fieldset class="fieldset w-full">
          <label class="label" for="username">Nom d'utilisteurice</label>
          <input
            type="text"
            id="username"
            class="input w-full"
            placeholder=""
            v-model="pathfinderCard.username"
          />
        </fieldset>
        <fieldset class="fieldset w-full">
          <label class="label" for="uid">UID</label>
          <input
            type="text"
            id="uid"
            class="input w-full"
            placeholder=""
            v-model="pathfinderCard.uid"
          />
        </fieldset>
      </div>
      <button class="btn btn-error btn-soft btn-block mt-2" @click="handleReset">
        Réinitialiser la carte
      </button>
      <button class="btn btn-neutral btn-block mt-2 transition-all" @click="download">
        <IconPhotoDown class="size-5" />
        Télécharger
      </button>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import AniimoBackgroundImage from '@/components/aniimo/AniimoBackgroundImage.vue';
import AniimoCaughtIcon from '@/components/icons/AniimoCaughtIcon.vue';
import AniimoPrismanaIcon from '@/components/icons/AniimoPrismanaIcon.vue';
import AniimoUmbrabowIcon from '@/components/icons/AniimoUmbrabowIcon.vue';
import SmoothAngleIcon from '@/components/icons/SmoothAngleIcon.vue';
import aniimoData from '@/data/aniimo.json';
import { useAniilogStore } from '@/stores/aniilog';
import { getAniimoImageUrl } from '@/utils/image';
import { Sketch } from '@ckpack/vue-color';
import { IconId, IconPhotoDown } from '@tabler/icons-vue';
import domtoimage from 'dom-to-image-more';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const modal = ref();
const pathfinderCardEl = ref();
const aniilogStore = useAniilogStore();
const { resetPathfinderCard } = aniilogStore;
const { statistics, pathfinderCard, aniimo: aniimoCaught } = storeToRefs(aniilogStore);
const presetColors = [
  '#2952c1',
  '#409eff',
  '#46c0d5',
  '#549de5',
  '#54b17b',
  '#6084ce',
  '#71b258',
  '#7561cb',
  '#a371d3',
  '#b67bdc',
  '#c0a778',
  '#e06060',
  '#e1c428',
  '#e97995',
  '#f6a83a',
  '#ff83f1',
];

const openModal = () => {
  modal.value.showModal();
};

const filteredAniimo = computed(() => {
  return aniimoData
    .filter((aniimo) => aniimo.fields.Image[0]?.path)
    .filter((aniimo) => aniimoCaught.value.indexOf(aniimo.id) >= 0)
    .map((aniimo) => ({
      id: aniimo.id,
      name: aniimo.fields.Title,
      form: aniimo.fields.Form.fields.Title,
    }));
});

const aniimoImage = computed(() => {
  if (pathfinderCard.value.aniimo) {
    const aniimo = aniimoData.find((aniimo) => aniimo.id === pathfinderCard.value.aniimo);
    if (aniimo && aniimo.fields.Image[0]?.path) {
      return getAniimoImageUrl(aniimo.fields.Image[0].path);
    }
  }

  return null;
});

interface VueColorValue {
  hex: string;
  hex8: string;
  hsl: { h: number; s: number; l: number; a: number };
  hsv: { h: number; s: number; v: number; a: number };
  rgba: { r: number; g: number; b: number; a: number };
  a: number;
}

const onChangeColor = (value: any): void => {
  pathfinderCard.value.color = (value as VueColorValue).hex;
};

const onChangeBackground = (value: any): void => {
  pathfinderCard.value.background = (value as VueColorValue).hex;
};

const download = async () => {
  const dataUrl = await domtoimage.toPng(pathfinderCardEl.value, { scale: 1 });
  const a = document.createElement('a');
  a.download = 'image.png';
  a.href = dataUrl;
  a.click();
};

const handleReset = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser votre carte de nomade ?')) {
    resetPathfinderCard();
  }
};
</script>

<style scoped>
.label {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
