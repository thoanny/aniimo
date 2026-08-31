<script setup lang="ts">
import { IconExternalLink } from '@tabler/icons-vue';
import AniimoFansiteLogo from './assets/AniimoFansiteLogo.vue';
</script>

<template>
  <header class="mb-6">
    <div class="navbar bg-aniimo-dark text-neutral-content shadow-sm">
      <div class="flex-1">
        <RouterLink to="/" class="inline-flex gap-1 px-2 text-xl items-center">
          <AniimoFansiteLogo class="size-10" />
          <span class="hidden sm:block">Aniimo | Fansite</span>
        </RouterLink>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
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

<style scoped></style>
