<template>
  <Teleport to="body">
    <ul
      v-if="visible"
      class="menu bg-base-100 rounded-lg shadow-lg w-auto z-[9999] whitespace-nowrap [&_li>*]:rounded-none [&_li>details>summary]:rounded-none p-0 overflow-hidden"
      :style="{ position: 'fixed', left: x + 'px', top: y + 'px' }"
      @click.stop
    >
      <slot />
    </ul>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  visible: Boolean,
  x: Number,
  y: Number,
});
</script>
