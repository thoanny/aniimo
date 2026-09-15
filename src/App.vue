<script setup lang="ts">
import AniimoFansiteLogo from '@/assets/AniimoFansiteLogo.vue';
import { IconArrowBigUpFilled, IconExternalLink, IconFlame } from '@tabler/icons-vue';
import { onMounted, onUnmounted, ref } from 'vue';

const isScrolled = ref<boolean>(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 800;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header class="mb-6">
    <div class="navbar bg-neutral text-neutral-content shadow-sm">
      <div class="flex-1">
        <RouterLink to="/" class="inline-flex gap-1 px-2 text-xl items-center">
          <AniimoFansiteLogo class="size-8" />
          <span class="hidden sm:block">Aniimo | Fansite</span>
        </RouterLink>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <RouterLink to="/t-potes" active-class="menu-active text-primary">
              <IconFlame class="size-4" />
              T-potes
            </RouterLink>
          </li>
          <li>
            <a href="https://www.aniimo.com/fr/main" target="_blank" rel="nofollow">
              Site officiel
              <IconExternalLink class="size-4" />
            </a>
          </li>
          <li>
            <a href="https://wiki.aniimo.com" target="_blank" rel="nofollow">
              Wiki
              <IconExternalLink class="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <main class="container mx-auto">
    <RouterView />
    <button
      class="btn btn-neutral btn-square fixed bottom-3 right-3 z-999"
      @click="scrollToTop"
      v-show="isScrolled"
    >
      <IconArrowBigUpFilled class="size-5" />
    </button>
  </main>
  <footer class="container mx-auto py-6 text-sm text-center">
    Tous les logos, marques et images de ce site sont la propriété de Pawprint Interactive
    Entertainment Pte. Ltd.<br />Ce site n'est pas affilié avec l'éditeur. Réalisé par
    <a href="https://thoanny.fr" target="_blank" class="underline">Thoanny</a> •
    <a href="https://api.thoanny.fr/legal-notice" target="_blank" class="underline"
      >Mentions légales</a
    >
  </footer>
</template>
