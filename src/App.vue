<script setup lang="ts">
import AniimoFansiteLogo from '@/assets/AniimoFansiteLogo.vue';
import AppMenu from '@/components/AppMenu.vue';
import { IconArrowBigUpFilled } from '@tabler/icons-vue';
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
    <div class="navbar bg-neutral shadow-sm justify-between">
      <div class="text-neutral-content">
        <RouterLink to="/" class="flex gap-1 px-2 text-lg items-end">
          <AniimoFansiteLogo class="size-8" />
          <span class="leading-3.5 font-semibold"
            >Aniimo<br /><small class="text-xs font-normal">Fansite</small></span
          >
        </RouterLink>
      </div>
      <div>
        <AppMenu />
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
