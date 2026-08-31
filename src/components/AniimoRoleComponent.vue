<template>
  <div
    class="bg-neutral text-neutral-content aspect-square rounded-full flex items-center justify-center"
  >
    <div v-if="role?.fields.Icon" v-html="role.fields.Icon" class="p-1"></div>
  </div>
</template>

<script setup lang="ts">
import roles from '@/data/roles.json';

const props = defineProps<{
  roleId: number;
}>();

const role = roles.find((role) => role.id === props.roleId);
</script>

<style scoped>
div :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
