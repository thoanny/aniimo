<template>
  <div
    class="text-base-100 aspect-square rounded-full flex items-center justify-center"
    :class="`bg-element-${elementClss}`"
  >
    <div v-if="element?.fields.Icon" v-html="element.fields.Icon" class="p-1"></div>
  </div>
</template>

<script setup lang="ts">
import elements from '@/data/elements.json';

const props = defineProps<{
  elementId: number;
}>();

const element = elements.find((element) => element.id === props.elementId);
const elementClss = element?.fields.Title.toLowerCase();
</script>

<style scoped>
div :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
