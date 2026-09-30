<template>
  <div
    class="bg-neutral text-neutral-content aspect-square rounded-full flex items-center justify-center"
  >
    <div v-if="stage?.fields.Icon" v-html="stage.fields.Icon" class="p-1"></div>
  </div>
</template>

<script setup lang="ts">
import stages from '@/data/stages.json';

const props = defineProps<{
  stageId: number;
}>();

const stage = stages.find((stage) => stage.id === props.stageId);
</script>

<style scoped>
div :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
