<script lang="ts" setup>
import { IconFlame, IconHearts } from '@tabler/icons-vue';
import { onMounted, ref } from 'vue';

interface TPote {
  id: number;
  network: string;
  active: boolean;
  name: string;
}

const tpotes = ref<TPote[]>([]);

onMounted(async () => {
  await fetch('https://api.thoanny.fr/tpotes')
    .then((res) => res.json())
    .then((data) => {
      const tpotesList: TPote[] = data.tpotes;
      tpotes.value = tpotesList.sort((a, b) => a.name.localeCompare(b.name));
    });
});
</script>

<template>
  <div class="container mx-auto text-center !max-w-2xl py-6">
    <h1 class="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-primary">
      <IconFlame class="h-12 w-12" stroke-width="1.5" />
      Les T-potes
      <IconFlame class="h-12 w-12" stroke-width="1.5" />
    </h1>
    <p class="mb-4 text-lg">
      <strong>Merci infiniment à tou·te·s mes abonné·e·s sur Twitch !</strong>
    </p>
    <p class="mb-4 text-lg">
      Votre soutien fait toute la différence et me permet de continuer à créer du contenu et à
      travailler sur mes projets personnels. Que ce soit à travers vos abonnements ou vos
      encouragements, vous êtes une véritable source de motivation.
    </p>
    <p class="mb-4 text-lg">
      Merci de croire en ce que je fais et de rendre cette aventure possible.
    </p>
    <p class="text-xl mb-4 flex justify-center text-primary">
      <IconHearts class="h-12 w-12" stroke-width="1.5" />
    </p>
    <h2 class="text-lg font-bold mb-4">
      T-potes abonné·e·s via
      <a
        href="https://www.twitch.tv/thoanny"
        target="_blank"
        rel="nofollow"
        class="underline underline-offset-2"
        >Twitch</a
      >
    </h2>
    <div class="flex flex-wrap gap-2 justify-center mb-6 mt-2">
      <span v-for="tpote in tpotes" :key="tpote.id" class="badge badge-primary badge-lg">
        {{ tpote.name }}
      </span>
    </div>
  </div>
</template>
