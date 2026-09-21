<template>
  <button class="btn btn-neutral btn-block lg:btn-square" @click="openModal">
    <IconTransfer stroke="1.75" class="size-5" />
    <span class="lg:hidden">Import/Export</span>
  </button>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-xs">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold leading-none flex gap-2 items-center">
        <IconTransfer />
        Import/Export
      </h3>
      <p class="mt-4">
        Pour récupérer votre progression, scannez ce QR Code ou utilisez votre adresse
        personnalisée.
      </p>
      <div>
        <img v-if="qrcode" :src="qrcode" alt="QR code de transfert" class="mx-auto mt-4" />
      </div>
      <div
        class="bg-neutral text-neutral-content py-3 px-4 rounded-box mt-4 break-all text-xs select-none cursor-pointer"
        @click="copyToClipboard"
      >
        {{ exportCodeLink }}
      </div>
      <button
        class="btn btn-neutral btn-block mt-2 transition-all"
        @click="copyToClipboard"
        :class="{
          'btn-neutral': !isCopied,
          'btn-success': isCopied,
        }"
      >
        <IconClipboardCheck class="size-5" v-if="isCopied" />
        <IconClipboard class="size-5" v-else />
        {{ isCopied ? 'Lien copié !' : 'Copier le lien' }}
      </button>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { useAniilogStore } from '@/stores/aniilog';
import { IconClipboard, IconClipboardCheck, IconTransfer } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const modal = ref();
const isCopied = ref<boolean>(false);
const aniilogStore = useAniilogStore();
const { generateQRCode } = aniilogStore;
const { exportCodeLink, qrcode } = storeToRefs(aniilogStore);

const openModal = () => {
  generateQRCode();
  modal.value.showModal();
};

const copyToClipboard = async () => {
  console.log('copytoclipboard');
  try {
    await navigator.clipboard.writeText(exportCodeLink.value);
    isCopied.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => {
      isCopied.value = false;
    }, 3_000);
  }
};

onMounted(() => {
  modal.value.addEventListener('close', () => {
    qrcode.value = '';
  });
});
</script>
